import axios from 'axios';
import { Buffer } from 'buffer';
import { settingsStore } from '../store/settingsStore';

function escapeSparqlString(value: string): string {
  // Escape SPARQL string literal metacharacters
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
}

export const fusekiApi = {
  async sparqlQuery(query: string) {
    const url = await settingsStore.getFusekiUrl();
    const user = await settingsStore.getFusekiUser();
    const pass = await settingsStore.getFusekiPassword();

    const endpoint = `${url}/ds/query`;
    const auth = Buffer.from(`${user}:${pass}`).toString('base64');

    const response = await axios.post(endpoint, `query=${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/sparql-results+json',
      }
    });
    return response.data;
  },

  async getImplications(keyword: string) {
    // Use VALUES clause to safely parameterize the keyword instead of interpolation
    const safeKeyword = escapeSparqlString(keyword);
    const query = `
      PREFIX : <http://llicorp.com/ontology/memos#>
      SELECT ?implication WHERE {
        VALUES ?kw { "${safeKeyword}" }
        ?s :keyword ?kw ;
           :implies ?implication .
      }
    `;
    return this.sparqlQuery(query);
  }
};
