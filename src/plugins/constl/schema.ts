import { bds } from '@constl/ipa';

import {
  dateVarId,
  dateColId,
  streamFlowVarId,
  streamFlowColId,
  workshopKeyword,
  workshopTableUniqueId,
} from './config';

export const DBSchema: bds.schémaSpécificationBd = {
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
          idVariable: streamFlowVarId,
          idColonne: streamFlowColId,
        },
      ],
    },
  ],
};
