// Modified from https://github.com/justin-coberly/dagre-d3-react - Justin Coberly
import React, { Component, createRef } from "react";
import dagreD3 from "dagre-d3";
import * as d3 from "d3";

class DagreGraph extends Component {
  svg = createRef();
  innerG = createRef();

  static defaultProps = {
    zoomable: false,
    fitBoundaries: false,
    className: "dagre-d3-react"
  };
  componentDidMount() {
    this._drawChart();
  }
  componentDidUpdate() {
    this._drawChart();
  }

  _getNodeData(id) {
    return this.props.nodes.find(node => node.id === id);
  }

  _drawChart = () => {
    const {
      nodes,
      links,
      zoomable,
      fitBoundaries,
      config,
      animate,
      shape,
      onNodeClick,
      onRelationshipClick
    } = this.props;
    let g = new dagreD3.graphlib.Graph().setGraph(config || {});
    console.log("hell");

    nodes.forEach(node =>
      g.setNode(node.id, {
        label: node.label,
        class: node.class || "",
        labelType: node.labelType || "string",
        ...node.config
      })
    );

    if (shape) {
      g.nodes().forEach(v => (g.node(v).shape = shape));
    }

    links.forEach(link =>
      g.setEdge(link.source, link.target, {
        label: link.label || "",
        class: link.class || "",
        ...link.config
      })
    );

    let render = new dagreD3.render();
    let svg = d3.select(this.svg.current);
    let inner = d3.select(this.innerG.current);

    let zoom = d3
      .zoom()
      .on("zoom", () => inner.attr("transform", d3.event.transform));

    if (zoomable) {
      svg.call(zoom);
    }
    if (animate) {
      g.graph().transition = function transition(selection) {
        return selection.transition().duration(animate || 1000);
      };
    }

    render.shapes().img = function circle(parent, bbox, node) {
      var shapeSvg = parent
        .insert("image")
        .attr("class", "nodeImage")
        .attr("xlink:href", function(d) {
          if (node) {
            console.log(node);
            if (node.class === "person") {
              return "./assets/person.png";
            } else {
              return "./assets/ownerCompany.png";
            }
          }
        })
        .attr("x", "-20px")
        .attr("y", "-20px")
        .attr("width", "40px")
        .attr("height", "40px");

      node.intersect = (point) => {
        return dagreD3.intersect.circle(node, 20, point);
      };
      return shapeSvg;
    };

    render(inner, g);

    if (fitBoundaries) {
      //@BertCh recommendation for fitting boundaries
      const bounds = inner.node().getBBox();
      const parent = inner.node().parentElement;
      const fullWidth = parent.clientWidth || parent.parentNode.clientWidth;
      const fullHeight = parent.clientHeight || parent.parentNode.clientHeight;
      const width = bounds.width;
      const height = bounds.height;
      const midX = bounds.x + width / 2;
      const midY = bounds.y + height / 2;
      if (width === 0 || height === 0) return; // nothing to fit
      var scale = 0.9 / Math.max(width / fullWidth, height / fullHeight);
      var translate = [
        fullWidth / 2 - scale * midX,
        fullHeight / 2 - scale * midY
      ];
      var transform = d3.zoomIdentity
        .translate(translate[0], translate[1])
        .scale(scale);

      svg
        .transition()
        .duration(animate || 0) // milliseconds
        .call(zoom.transform, transform);
    }

    if (onNodeClick) {
      svg.selectAll("g.node").on("click", id => {
        let _node = g.node(id);
        let _original = this._getNodeData(id);
        onNodeClick({ d3node: _node, original: _original });
      });
    }
    if (onRelationshipClick) {
      svg.selectAll("g.edgeLabel").on("click", id => {
        let _source = g.node(id.v);
        let _original_source = this._getNodeData(id.v);

        let _target = g.node(id.w);
        let _original_target = this._getNodeData(id.w);
        onRelationshipClick({
          d3source: _source,
          source: _original_source,
          d3target: _target,
          target: _original_target
        });
      });
    }
  };

  render() {
    return (
      <svg
        width={this.props.width}
        height={this.props.height}
        ref={this.svg}
        className={this.props.className || ""}
      >
        <g ref={this.innerG} />
      </svg>
    );
  }
}

export default DagreGraph;
