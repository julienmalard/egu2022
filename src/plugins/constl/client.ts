import {
  proxy, réseau, utils, valid,
} from '@constl/ipa';

import { DBSchema } from './schema';

import {
  dateColId,
  streamFlowColId,
  workshopTableUniqueId,
  workshopKeyword,
} from './config';

export type WorkshopData = {
  [dateColId]: number;
  [streamFlowColId]: string;
};

export default class Client {
  constellation: proxy.proxy.ProxyClientConstellation;

  constructor() {
    const accountId = localStorage.getItem('Account id') || undefined;
    this.constellation = proxy.ipa.default({ compte: accountId });
  }

  async followTableId({ f }: {
    f: utils.schémaFonctionSuivi<string | undefined>
  }): Promise<utils.schémaFonctionOublier> {
    return await this.constellation.bds!.suivreTableauUniqueDeBdUnique({
      schémaBd: DBSchema,
      motClefUnique: workshopKeyword,
      idUniqueTableau: workshopTableUniqueId,
      f,
    });
  }

  async addData({ tableId, date, streamflow }: {
    tableId: string,
    date: Date,
    streamflow: number,
  }): Promise<void> {
    const newData = {
      [dateColId]: date.getTime(),
      [streamFlowColId]: streamflow,
    };
    await this.constellation.tableaux!.ajouterÉlément({ idTableau: tableId, vals: newData });
  }

  async deleteData({ lineId }: {lineId: string}): Promise<void> {
    const tableId = await utils.uneFois(
      async (f: utils.schémaFonctionSuivi<string | undefined>) => await this.followTableId({ f }),
    );
    if (tableId) {
      await this.constellation.tableaux!.effacerÉlément(
        { idTableau: tableId, empreinteÉlément: lineId },
      );
    }
  }

  async deleteAllData(): Promise<void> {
    const entryIds = await utils.uneFois(
      async (f: utils.schémaFonctionSuivi<string[]>) => await this.followMyData({
        f: ((data: valid.élémentDonnées<WorkshopData>[]) => f(data.map((d) => d.empreinte))),
      }),
    );
    await Promise.all(entryIds.map((entryId) => this.deleteData({ lineId: entryId })));
  }

  async followMyData({ f }: {
    f: utils.schémaFonctionSuivi<
      valid.élémentDonnées<WorkshopData>[]
    >
  }): Promise<utils.schémaFonctionOublier> {
    let forgetData: utils.schémaFonctionOublier;
    let tableId: string | undefined;

    const fFollowColId = async (newTableId?: string) => {
      if (tableId === newTableId) return;
      tableId = newTableId;
      if (forgetData) forgetData();
      if (newTableId) {
        forgetData = await this.constellation.tableaux!.suivreDonnées({
          idTableau: newTableId,
          f,
        });
      }
    };
    const fForgetColId = await this.followTableId(
      { f: fFollowColId },
    );
    return () => {
      fForgetColId();
      if (forgetData) forgetData();
    };
  }

  async followAllData(
    f: utils.schémaFonctionSuivi<
      réseau.élémentDeMembre<WorkshopData>[]
    >,
  ): Promise<utils.schémaFonctionOublier> {
    const { fOublier } = await this.constellation.réseau!.suivreÉlémentsDeTableauxUniques({
      motClefUnique: workshopKeyword,
      idUniqueTableau: workshopTableUniqueId,
      f,
    });
    return fOublier;
  }
}
