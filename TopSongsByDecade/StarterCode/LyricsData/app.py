import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import (
    Flask, 
    jsonify, 
    render_template, 
    request, 
    redirect)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################

from flask_sqlalchemy import SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '') or "sqlite:///db/lyricsupdated.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
Samples_Metadata = Base.classes.sample_metadata
Samples = Base.classes.samples


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/names")
def names():
    """Return a list of sample names."""

    # Use Pandas to perform the sql query
    stmt = db.session.query(Samples_Metadata).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    # Return a list of the column names (sample names)
    return jsonify(list(df.Era.unique()))

@app.route("/artists/<sample>")
def artists(sample):
    """Return a list of artists names."""
    sel = [
        Samples_Metadata.sample,
        Samples_Metadata.Genre,
        Samples_Metadata.Artist,
        Samples_Metadata.Song,
        Samples_Metadata.Year,
        Samples_Metadata.Decade,
        Samples_Metadata.Era,
        Samples_Metadata.Lyrics,
    ]

    results = db.session.query(*sel).filter(Samples_Metadata.Era == sample).all()

    # print(results)
    # print(results[5])

    # Create a dictionary entry for each row of metadata information
    sample_metadata_list = []
    
    for result in results:
        sample_metadata = {}
        # sample_metadata["sample"] = result[0]
        # sample_metadata["Genre"] = result[1]
        sample_metadata["Artist"] = result[2]
        # sample_metadata["Song"] = result[3]
        # sample_metadata["Year"] = result[4]
        # sample_metadata["Decade"] = result[5]
        # sample_metadata["Era"] = result[6]
        # sample_metadata["Lyrics"] = result[7]

        sample_metadata_list.append(sample_metadata)
        
    print(sample_metadata_list)
    return jsonify(sample_metadata_list)

@app.route("/metadata/<sample>")
def sample_metadata(sample):
    """Return the MetaData for a given sample."""
    sel = [
        Samples_Metadata.sample,
        Samples_Metadata.Genre,
        Samples_Metadata.Artist,
        Samples_Metadata.Song,
        Samples_Metadata.Year,
        Samples_Metadata.Decade,
        Samples_Metadata.Era,
        Samples_Metadata.Lyrics,
    ]

    results = db.session.query(*sel).filter(Samples_Metadata.Era == sample).all()

    # print(results)
    # print(results[5])

    # Create a dictionary entry for each row of metadata information
    sample_metadata_list = []
    
    for result in results:
        sample_metadata = {}
        # sample_metadata["sample"] = result[0]
        sample_metadata["Genre"] = result[1]
        sample_metadata["Artist"] = result[2]
        sample_metadata["Song"] = result[3]
        sample_metadata["Year"] = result[4]
        # sample_metadata["Decade"] = result[5]
        # sample_metadata["Era"] = result[6]
        # sample_metadata["Lyrics"] = result[7]

        sample_metadata_list.append(sample_metadata)
        
    print(sample_metadata_list)
    return jsonify(sample_metadata_list)


@app.route("/samples/<sample>")
def samples(sample):
    """Return `otu_ids`, `otu_labels`,and `sample_values`."""
    stmt = db.session.query(Samples).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    # Filter the data based on the sample number and
    # only keep rows with values above 1
    sample_data = df.loc[df[sample] > 1, ["otu_id", "otu_label", sample]]
    # Format the data to send as json
    data = {
        "otu_ids": sample_data.otu_id.values.tolist(),
        "sample_values": sample_data[sample].values.tolist(),
        "otu_labels": sample_data.otu_label.tolist(),
    }
    return jsonify(data)


if __name__ == "__main__":
    app.run(port=5001)

