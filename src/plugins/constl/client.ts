import {
  proxy, réseau, utils, valid,
} from '@constl/ipa';
import { read as readXLSX } from 'xlsx';
import ImportateurFeuilleCalcul from '@/xlsx';

import DBSchema from './schema';

import {
  dateColId,
  streamFlowColId,
  siteColId,
  workshopTableUniqueId,
  workshopKeyword,
} from './config';

export type WorkshopData = {
  [dateColId]: number;
  [streamFlowColId]: number;
  [siteColId]: number;
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
    return this.constellation.bds!.suivreTableauUniqueDeBdUnique({
      schémaBd: DBSchema,
      motClefUnique: workshopKeyword,
      idUniqueTableau: workshopTableUniqueId,
      f,
    });
  }

  async addData({
    tableId, date, streamflow, site,
  }: {
    tableId: string,
    date: Date,
    streamflow: number,
    site: string,
  }): Promise<void> {
    const newData = {
      [dateColId]: date.getTime(),
      [streamFlowColId]: streamflow,
      [siteColId]: site,
    };
    await this.constellation.tableaux!.ajouterÉlément({ idTableau: tableId, vals: newData });
  }

  async readDataFromFile({ file }: {file: File}) {
    const tableId = await utils.uneFois(
      async (f: utils.schémaFonctionSuivi<string | undefined>) => this.followTableId({ f }),
    );
    if (!tableId) throw new Error('No table id');

    const fileData = await file.arrayBuffer();
    const doc = readXLSX(fileData, {
      type: 'buffer',
      cellDates: true,
    });
    const importer = new ImportateurFeuilleCalcul(doc);

    const data = importer.obtDonnées('Sheet1', {
      [dateColId]: 'dia',
      [siteColId]: 'sitio',
      [streamFlowColId]: 'flujo',
    }) as WorkshopData[];
    data.forEach(async (d) => {
      const year = Number(String(d[dateColId]).slice(-4));
      const month = Number(String(d[dateColId]).slice(0, -4));
      const date = new Date(year, month, 1);
      const site = String(d[siteColId]);

      await this.addData({
        tableId, date, streamflow: d[streamFlowColId], site,
      });
    });
  }

  async deleteData({ lineId }: {lineId: string}): Promise<void> {
    const tableId = await utils.uneFois(
      async (f: utils.schémaFonctionSuivi<string | undefined>) => this.followTableId({ f }),
    );
    if (tableId) {
      await this.constellation.tableaux!.effacerÉlément(
        { idTableau: tableId, empreinteÉlément: lineId },
      );
    }
  }

  async deleteAllData(): Promise<void> {
    const entryIds = await utils.uneFois(
      async (f: utils.schémaFonctionSuivi<string[]>) => this.followMyData({
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
