import { HttpClient, HttpContext } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { USE_API_URL } from "common";
import { firstValueFrom, ReplaySubject } from "rxjs";

const API_URL = "groundwater-levels";

export type StationId = string;

/**
 * Measurement classifications accordings to NLWKN.
 * 
 * @link https://www.grundwasserstandonline.nlwkn.niedersachsen.de/Hinweis#einstufungGrundwasserstandsklassen
 */
export enum MeasurementClassification {
  MAX_EXCEEDED = "Höchstwert überschritten",
  VERY_HIGH = "sehr hoch",
  HIGH = "hoch",
  NORMAL = "normal",
  LOW = "niedrig",
  VERY_LOW = "sehr niedrig",
  MIN_UNDERSHOT = "Niedrigstwert unterschritten"
}

export interface Measurement {
  station: StationId,
  date: Date,
  classification: MeasurementClassification | null,
  waterLevelNHN: number | null,
  waterLevelGOK: number | null
}

export type MeasurementRecord = Record<StationId, Measurement>;

@Injectable({
  providedIn: 'root'
})
export class GrowlService {

  private fetchedMeasurements = new Map<Date, MeasurementRecord>();
  private measurementSubject = new ReplaySubject<MeasurementRecord>();
  public measurement = this.measurementSubject.asObservable();

  constructor(private http: HttpClient) { }

  async fetchMeasurementClassifications(
    date: Date = new Date()
  ): Promise<Record<StationId, Measurement>> {
    let entry = this.fetchedMeasurements.get(date);
    if (entry) {
      this.measurementSubject.next(entry);
      return entry;
    }

    let url = `${API_URL}/graphql`;
    let gqlBody = {
      query: `{
        measurements(
          from: "${date.toISOString()}"
          until: "${date.toISOString()}"
        ) {
          station
          date
          classification
          waterLevelNHN
          waterLevelGOK
        }
      }`
    }

    interface ResponseType {
      data: {
        measurements: {
          station: StationId,
          date: string,
          classification: MeasurementClassification | "",
          waterLevelNHN: number | null,
          waterLevelGOK: number | null
        }[]
      }
    };

    let response = await firstValueFrom(this.http.post<ResponseType>(
      url,
      gqlBody,
      { context: new HttpContext().set(USE_API_URL, true) }
    ));

    entry = Object.fromEntries(
      Object.values(response.data.measurements).map(m => [m.station, {
        ...m,
        date: new Date(m.date),
        classification: m.classification || null,
      } as Measurement])
    );

    this.fetchedMeasurements.set(date, entry);
    this.measurementSubject.next(entry);
    return entry;
  }
}
