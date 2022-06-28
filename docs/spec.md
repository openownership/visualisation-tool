# BODS Visualiser Specification

This document outlines the functionality and requirements of the [BODS Visualiser](https://github.com/openownership/visualisation-tool).

Refer to the full [BODS documentation](https://standard.openownership.org/en/0.3.0/) for more information (and the associated [github repository](https://github.com/openownership/data-standard)). 


## Data requirements

The visualiser requires JSON data with a minimum set of data fields to produce a directed graph. It is not necessary for the supplied JSON data to be valid BODS data, but it must meet these minimum requirements.

This is not a full schema. The following tables represent the opinionated requirements of the visualiser. Any schema fields that are not present in the tables below are not currently used in the generation of graphs by the visualiser tool and will be ignored.


### Edges
Edges are drawn using BODS (or BODS-like) [ownership or control statements](https://standard.openownership.org/en/0.3.0/schema/schema-browser.html#ownership-or-control-statement)

<table>
  <tr>
   <td><strong>Field</strong>
   </td>
   <td><strong>Required</strong>
   </td>
   <td><strong>Notes</strong>
   </td>
  </tr>
  <tr>
   <td>statementID
   </td>
   <td>Yes
   </td>
   <td>A unique ID for this statement
   </td>
  </tr>
  <tr>
   <td>statementType
   </td>
   <td>Yes
   </td>
   <td>Must be "ownershipOrControlStatement" to generate edge
   </td>
  </tr>
  <tr>
   <td>subject
   </td>
   <td>Yes
   </td>
   <td>This is the connecting node and is required
   </td>
  </tr>
  <tr>
   <td>subject.describedByPersonStatement
   </td>
   <td>(Yes)
   </td>
   <td>Must contain a `statementID` from a person node or an entity node in the dataset
   </td>
  </tr>
  <tr>
   <td>subject.describedByEntityStatement
   </td>
   <td>(Yes)
   </td>
   <td>Must contain a `statementID` from a person node or an entity node in the dataset
   </td>
  </tr>
  <tr>
   <td>interestedParty
   </td>
   <td>No
   </td>
   <td>Creates an unknown node if object is empty (can contain either describedByPersonStatement or describedByEntityStatement)
   </td>
  </tr>
  <tr>
   <td>interestedParty.describedByPersonStatement
   </td>
   <td>No
   </td>
   <td>Either person or entity should be supplied otherwise unknown is assumed
   </td>
  </tr>
  <tr>
   <td>interestedParty.describedByEntityStatement
   </td>
   <td>No
   </td>
   <td>Either person or entity should be supplied otherwise unknown is assumed
   </td>
  </tr>
  <tr>
   <td>interests
   </td>
   <td>No
   </td>
   <td>"<em>Interest details unknown</em>" label applied if empty array
   </td>
  </tr>
  <tr>
   <td>interests.type
   </td>
   <td>No
   </td>
   <td>No edge drawn if missing. Only shareholding or votingRights shown
   </td>
  </tr>
  <tr>
   <td>interests.interestLevel (BODS v0.2)/interests.directOrIndirect (BODS v0.3)
   </td>
   <td>No
   </td>
   <td>Direct interests are shown as solid lines, indirect or unknown are shown as dotted lines
   </td>
  </tr>
  <tr>
   <td>interests.share
   </td>
   <td>No
   </td>
   <td>No labels applied if this field is missing
   </td>
  </tr>
  <tr>
   <td>interests.share.min
   </td>
   <td>No
   </td>
   <td>Used to calculate a min - max range
   </td>
  </tr>
  <tr>
   <td>interests.share.max
   </td>
   <td>No
   </td>
   <td>Used to calculate a min - max range
   </td>
  </tr>
  <tr>
   <td>interests.share.exact
   </td>
   <td>No
   </td>
   <td>Takes precedence over min and max values
   </td>
  </tr>
</table>



### Person Nodes
Person nodes are drawn using BODS (or BODS-like) [person statements](https://standard.openownership.org/en/0.3.0/schema/schema-browser.html#person-statement)

<table>
  <tr>
   <td><strong>Field</strong>
   </td>
   <td><strong>Required</strong>
   </td>
   <td><strong>Notes</strong>
   </td>
  </tr>
  <tr>
   <td>statementID
   </td>
   <td>Yes
   </td>
   <td>A unique ID for this node
   </td>
  </tr>
  <tr>
   <td>StatementType
   </td>
   <td>Yes
   </td>
   <td>Must be "personStatement" to generate person node
   </td>
  </tr>
  <tr>
   <td>names
   </td>
   <td>No
   </td>
   <td>Unknown person will be used if this data is missing. The name types will be used in the following order: 'individual', 'transliteration', 'alternative', 'birth', 'translation', 'former'. Unnamed person will be used if any specific name data is missing.
   </td>
  </tr>
  <tr>
   <td>names.fullName
   </td>
   <td>No
   </td>
   <td>This field takes precedence
   </td>
  </tr>
  <tr>
   <td>names.givenName
   </td>
   <td>No
   </td>
   <td>The name is a join of [givenName, patronymicName, familyName] if fullName is omitted
   </td>
  </tr>
  <tr>
   <td>names.patronymicName
   </td>
   <td>No
   </td>
   <td>The name is a join of [givenName, patronymicName, familyName] if fullName is omitted
   </td>
  </tr>
  <tr>
   <td>names.familyName
   </td>
   <td>No
   </td>
   <td>The name is a join of [givenName, patronymicName, familyName] if fullName is omitted
   </td>
  </tr>
  <tr>
   <td>personType
   </td>
   <td>No
   </td>
   <td>Unknown person will be assumed if the personType is missing.
   </td>
  </tr>
  <tr>
   <td>nationalities
   </td>
   <td>No
   </td>
   <td>No flags will be drawn if these data are missing. The visualiser only uses the first nationality in the nationalities array.
   </td>
  </tr>
  <tr>
   <td>nationalities.code
   </td>
   <td>No
   </td>
   <td>No flag will be drawn if the country code is missing. The visualiser only uses the first nationality in the nationalities array.
   </td>
  </tr>
</table>



### Entity Nodes
Entity nodes are drawn using BODS (or BODS-like) [entity statements](https://standard.openownership.org/en/0.3.0/schema/schema-browser.html#entity-statement).

<table>
  <tr>
   <td><strong>Field</strong>
   </td>
   <td><strong>Required</strong>
   </td>
   <td><strong>Notes</strong>
   </td>
  </tr>
  <tr>
   <td>statementID
   </td>
   <td>Yes
   </td>
   <td>Unique ID for this node
   </td>
  </tr>
  <tr>
   <td>statementType
   </td>
   <td>Yes
   </td>
   <td>Must be 'entityStatement' for entity node
   </td>
  </tr>
  <tr>
   <td>name
   </td>
   <td>No
   </td>
   <td>No label shown if missing
   </td>
  </tr>
  <tr>
   <td>entityType
   </td>
   <td>No
   </td>
   <td>Assumes unknown node type when entityType is missing
   </td>
  </tr>
  <tr>
   <td>publicListing
   </td>
   <td>No
   </td>
   <td>Assumes entity is not listed if this field is missing
   </td>
  </tr>
  <tr>
   <td>incorporatedInJurisdiction (BODS v0.2)/jurisdiction (BODS v0.3)
   </td>
   <td>No
   </td>
   <td>No flags are drawn if this field is missing.
   </td>
  </tr>
  <tr>
   <td>jurisdiction.code
   </td>
   <td>No
   </td>
   <td>No flags are drawn if this field is missing.
   </td>
  </tr>
</table>

