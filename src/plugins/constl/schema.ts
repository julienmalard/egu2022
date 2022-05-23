import { bds } from '@constl/ipa';

import {
  dateVarId,
  dateColId,
  streamFlowVarId,
  streamFlowColId,
  siteVarId,
  siteColId,
  workshopKeyword,
  workshopTableUniqueId,
} from './config';

export default {
  motsClefs: [workshopKeyword],
  licence: 'ODbl-1_0',
  tableaux: [
    {
      idUnique: workshopTableUniqueId,
      cols: [
        {
          idVariable: dateVarId,
          idColonne: dateColId,
        },
        {
          idVariable: siteVarId,
          idColonne: siteColId,
        },
        {
          idVariable: streamFlowVarId,
          idColonne: streamFlowColId,
        },
      ],
    },
  ],
} as bds.schémaSpécificationBd;
