# BODS visualisation library specification

This document outlines the functionality and requirements of the [BODS visualisation library](https://github.com/openownership/visualisation-tool).

Refer to the full [BODS documentation](https://standard.openownership.org/en/latest) for more information (and the associated [Github repository](https://github.com/openownership/data-standard)). 

## Data requirements for visual features

The visualisation library requires JSON data with a minimum set of data fields to produce a directed graph. It is not necessary for the supplied JSON data to be valid BODS data, but it must meet some minimum requirements.

The following sections and tables show the visual features rendered by the tool and what fields they require in the given format of data. Any schema fields that are not present in the tables below are not currently used in the generation of graphs by the visualiser tool and will be ignored.

### General

The format of the data presented to the tool:

- MUST be a valid JSON array of objects
- is presumed to be BODS 0.4-like, unless the first object in the JSON array has a `publicationDetails.bodsVersion` value of '0.2' or '0.3', in which case all objects will be presumed to be BODS 0.2/0.3-like.
- is presumed to have a time dimension (that is to show the properties of people, entities and relationships changing over a period of time) if:
  - In BODS 0.2 or 0.3-like data, the `replacesStatements` field is present in any object and contains a value corresponding to the `statementID` value of a different object (both objects having the same `statementType` value).
  - In BODS 0.4-like data, there are multiple objects which share both a `recordId` value and a `recordType` value.

The list of JSON objects presented to the tool is first filtered to represent a snapshot in time (if the data has a time dimension). Then it is processed to draw person nodes, entity nodes and relationship edges.

### Filtering data to produce a snapshot in time

#### BODS 0.2 or 0.3-like data

Only the latest data in a dataset is retained and rendered. If an object (X) has a `statementID` value which appears in the `replacesStatements` array of any other object in the dataset AND both objects have the `statementType` (of 'ownershipOrControlStatement', 'entityStatement', or 'personStatement') then X is filtered out.

#### BODS 0.4-like data

A timepoint is a date (not a date-time). To produce a snapshot for a timepoint, T, we take the following approach:

1. Objects are grouped, which have both matching `recordId` and `recordType` values. (Where `recordType` is one of 'entity', 'person', or 'relationship'.) 
2. In each group:
   - for all objects with a `statementDate` value, if `statementDate` > T then filter out the object.
   - for all objects with a `statementDate` value, filter out all objects except one with the largest value.
   - if no objects have a `statementDate` value, filter out all but one object. Otherwise filter out all objects without a `statementDate`.
3. Only one object will be left in each group. These, plus any initial singleton objects are then filtered as follows:
   - If the object has `recordStatus` 'closed', filter it out.
   - If the object has `recordType` 'entity' and a `dissolutionDate` <= T, filter it out.
   - If the object has `recordType` 'person' and a `deathDate` <= T, filter it out.
   - If the object has `recordType` 'relationship', filter out all objects in the `interests` array where `endDate` <= T.

### Processing objects to render visual features
In the following tables, a feature may span multiple rows. In these cases, the conditions of the fields and their values in ALL the rows must be met in order for the feature to be rendered.
#### Person Nodes

| Feature | BODS 0.4 field | Value(s) | Required field? | BODS 0.2/0.3 field | Value(s) | Required field? |
| --- | --- | --- | --- | --- | --- | --- |
| Basic node drawn | `recordType` | 'person' | yes | `statementType` | 'personStatement' | yes |
| | `recordStatus` | Not 'closed' | no | | | |
| Node label drawn (default is 'Unknown person') | `recordDetails.names[]`\* | Value of 'fullName' or compound of other field values in name object | no | `names[]`* | Value of 'fullName' or compound of other field values in name object | no |
| Node icon drawn (default is unknown person icon) | `recordDetails.personType` | 'anonymousPerson', 'unknownPerson' or 'knownPerson' | no | `personType` | 'anonymousPerson', 'unknownPerson' or 'knownPerson' | no |
| Country flag drawn (default is no flag) | `recordDetails.nationalities[0].code` | The 2-letter country code (ISO 3166-1) or the subdivision code (ISO 3166-2) for the jurisdiction | no | `nationalities[0].code` | The 2-letter country code (ISO 3166-1) or the subdivision code (ISO 3166-2) for the jurisdiction | no |
| Node is connectable | `recordId` | Any string | no | `statementId` | Any string | no |

\* The name types will be used in the following order: 'individual', 'transliteration', 'alternative', 'birth', 'translation', 'former'.

#### Entity Nodes

| Feature | BODS 0.4 field | Value(s) | Required field? | BODS 0.2/0.3 field | Value(s) | Required field? |
| --- | --- | --- | --- | --- | --- | --- |
| Basic node drawn | `recordType` | 'entity' | yes | `statementType` | 'entityStatement' | yes |
| | `recordStatus` | not 'closed' | no | | | |
| Node label drawn (default is none) | `recordDetails.name` | Any string | no | `name` | Any string | no |
| Node icon drawn (default is unknown entity icon) | `recordDetails.entityType.type` | 'registeredEntity', 'legalEntity', 'arrangement', 'anonymousEntity', 'unknownEntity', 'state' or 'stateBody' | no | `entityType` | 'registeredEntity', 'legalEntity', 'arrangement', 'anonymousEntity', 'unknownEntity', 'state' or 'stateBody' | no |
| Public company node icon drawn | `recordDetails.publicListing.hasPublicListing` | `true` | no | `publicListing.hasPublicListing` | `true` | no |
| Country flag drawn (default is no flag) | `recordDetails.jurisdiction.code` | The 2-letter country code (ISO 3166-1) or the subdivision code (ISO 3166-2) for the jurisdiction | no | `incorporatedInJurisdiction.code` (BODS v0.2) or `jurisdiction.code` (BODS v0.3) | The 2-letter country code (ISO 3166-1) or the subdivision code (ISO 3166-2) for the jurisdiction | no |
| Node is connectable | `recordId` | Any string | no | `statementId` | Any string | no |

#### Edges

| Feature | BODS 0.4 field | Value(s) | Required field? | BODS 0.2/0.3 field | Value(s) | Required field? |
| --- | --- | --- | --- | --- | --- | --- |
| Edge is drawn (black dotted line, no label) | `recordType` | 'relationship' | yes | `statementType` | 'ownershipOrControlStatement' | yes |
| | `recordStatus` | not 'closed' | no | | | |
| | `recordDetails.subject` or `recordDetails.interestedParty` | `recordId` of a connectable node | yes | `subject` or `interestedParty` | `statementId` of a connectable node | yes |
| Unspecified node drawn and connected as interested party with label 'Unspecified' | `recordDetails.interestedParty` | type is object | no | `interestedParty.unspecified` | Any | no |
| Unspecified node drawn and connected as subject with label 'Unspecified' | `recordDetails.subject` | type is object | no | n/a | n/a | n/a |
| Unknown node drawn and connected as interested party | `recordDetails.interestedParty` field is missing or `interestedParty` is not a `recordId` string matching a connectable node | n/a | no | `interestedParty` field is missing or `interestedParty.describedBy[...]Statement` is not a `statementId` string matching a connectable node | n/a | no |
| Unknown node drawn and connected as subject | `recordDetails.subject` field is missing or `subject` is not a `recordId` string matching a connectable node | n/a | no | `subject.describedByEntityStatement` field is missing or `subject.describedByEntityStatement` is not a `statementId` string matching a connectable node | n/a | no |
| Edge line added: purple with 'owns' label (default is dotted) | `recordDetails.interests[].interestType` | At least one interest has `interestType` in the 'ownership' category** | no | `interests[].interestType` | At least one interest has `interestType` in the 'ownership' category** | no |
| ...line is made solid | `recordDetails.interests[].directOrIndirect` | At least one interest in the 'ownership' category** has value 'direct' | no | `interests[].interestLevel` (BODS v0.2) or `interests[].directOrIndirect` (BODS v0.3) | At least one interest in the 'ownership' category** has value 'direct' | no |
| Edge line added: light blue with 'controls' label (default is dotted) | `recordDetails.interests[].interestType` | At least one interest has `interestType` in the 'control' category** | no | `interests[].interestType` | At least one interest has `interestType` in the 'control' category** | no |
| ...line is made solid | `recordDetails.interests[].directOrIndirect` | At least one interest in the 'control' category** has value 'direct' | no | `interests[].interestLevel` (BODS v0.2) or `interests[].directOrIndirect` (BODS v0.3) | At least one interest in the 'control' category** has value 'direct' | no |
| Black edge is made solid | `recordDetails.interests[].directOrIndirect` | At least one interest not in the 'ownership' or 'control' category** has value 'direct' | no | `interests[].interestLevel` (BODS v0.2) or `interests[].directOrIndirect` (BODS v0.3) | At least one interest not in the 'ownership' or 'control' category** has value 'direct' | no |
| Thickness of 'owns' and 'controls' lines (plus label containing value, where it exists) | `recordDetails.interests[].share`, if `interestType` is 'shareholding' or 'votingRights' | Exact value takes precedence over a min-max range | no | `recordDetails.interests[].share`, if `interestType` is 'shareholding' or 'votingRights' | Exact value takes precedence over a min-max range | no |

\** The following table details which `interestType`s fall into which category:

| `interestType` | BODS 0.3 | BODS 0.4 | Category |
| --- | --- | --- | --- |
| `shareholding` | x | x | ownership |
| `votingRights` | x | x | control |
| `appointmentOfBoard` | x | x | control |
| `otherInfluenceOrControl` | x | x | control |
| `seniorManagingOfficial` | x | x | control |
| `settlor` | x | x | control |
| `trustee` | x | x | control |
| `protector` | x | x | control |
| `beneficiaryOfLegalArrangement` | x | x | ownership |
| `rightsToSurplusAssetsOnDissolution` | x | x | ownership |
| `rightsToProfitOrIncome` | x | x | ownership |
| `rightsGrantedByContract` | x | x | control |
| `conditionalRightsGrantedByContract` | x | x | control |
| `controlViaCompanyRulesOrArticles` | x | x | control |
| `controlByLegalFramework` | x | x | control |
| `boardMember` | x | x | control |
| `boardChair` | x | x | control |
| `unknownInterest` | x | x | - |
| `unpublishedInterest` | x | x | - |
| `enjoymentAndUseOfAssets` | x | x | ownership |
| `rightToProfitOrIncomeFromAssets` | x | x | ownership |
| `nominee` | | x | control |
| `nominator` | | x | control |
