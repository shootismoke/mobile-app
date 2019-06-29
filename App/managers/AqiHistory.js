class AqiHistory {
  _id;
  _location;
  _lat;
  _lng;
  _rawPm25;
  _creationTime;

  constructor ({ id, location, lat, lng, rawPm25, creationTime }) {
    this._id = id;
    this._location = location;
    this._lat = lat;
    this._lng = lng;
    this._rawPm25 = rawPm25;
    this._creationTime = creationTime;
  }

  get id () {
    return this._id;
  }

  get location () {
    return this._location;
  }

  get lat () {
    return this._lat;
  }

  get lng () {
    return this._lng;
  }

  get rawPm25 () {
    return this._rawPm25;
  }

  get creationTime () {
    return this._creationTime;
  }
}

export default AqiHistory;
