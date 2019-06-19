class AqiHistory {

  _id: number;
  _location: string;
  _lat: number;
  _lng: number;
  _rawPm25: number;
  _creationTime: number;

  constructor({ id, location, lat, lng, rawPm25, creationTime }) {
    this._id = id;
    this._location = location;
    this._lat = lat;
    this._lng = lng;
    this._rawPm25 = rawPm25;
    this._creationTime = creationTime;
  }

  get id(): number {
    return this._id;
  }

  get location(): string {
    return this._location;
  }

  get lat(): number {
    return this._lat;
  }

  get lng(): number {
    return this._lng;
  }

  get rawPm25(): number {
    return this._rawPm25;
  }

  get creationTime(): number {
    return this._creationTime;
  }
}

export default AqiHistory;
