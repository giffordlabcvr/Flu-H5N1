
var segment_genes = [ 'HA', 'MP', 'NA', 'NP', 'NS', 'PA', 'PB1', 'PB2' ];

var strainObjs;
glue.inMode("module/tabularUtility", function() {
	strainObjs = glue.tableToObjects(glue.command(["load-tabular", "tabular/SraRunTable.tsv"]));
});
//glue.logInfo("strainObjs", strainObjs);

var strainIDtoStrainObjs = {};
var i = 2;

_.each(strainObjs, function(strainObj) {

	glue.logInfo("row", i);
	glue.logInfo("StrainObj", strainObj);
	
	i++;

	var strainPK = strainObj["Run"];
	var isoCountry = strainObj["geo_loc_name_country"];
	var collectionDate = strainObj["Collection_Date"];
	var serotype = strainObj["serotype"];
	var host = strainObj["Host"];
	glue.logInfo("strain public key", strainPK);
	
	glue.command(["create", "custom-table-row", "isolate", strainPK]);

	_.each(segment_genes, function(segment_gene) {

		var segmentSeqID = strainPK + '_' + segment_gene;	
		var sourceName = 'iav-andersen-h5n1';

		glue.inMode("custom-table-row/isolate/"+strainPK, function() {

			//glue.logInfo("Linking sequence", segmentSeqID);
			glue.command(["add", "link-target", "sequence", "sequence/"+sourceName+"/"+segmentSeqID]);	
			glue.command(["set", "field", 'iso_country', isoCountry]);
			glue.command(["set", "field", 'iso_year', collectionDate]);
			glue.command(["set", "field", 'hn_subtype', serotype]);
			glue.command(["set", "field", 'iso_host', host]);

		});
	
	});

});

