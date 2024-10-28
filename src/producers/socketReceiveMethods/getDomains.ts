import { RtpCapabilities } from 'mediasoup-client/lib/types';
import {
  ConnectIpsType, ConnectIpsParameters, AltDomains, ConsumeSocket,
} from '../../@types/types';

export interface GetDomainsParameters extends ConnectIpsParameters {

  roomRecvIPs: string[];
  rtpCapabilities: RtpCapabilities | null;
  consume_sockets: ConsumeSocket[];

  // mediasfu functions
  connectIps: ConnectIpsType;
  getUpdatedAllParams: () => GetDomainsParameters;

  [key: string]: any;

}

export interface GetDomainsOptions {
  domains: string[];
  alt_domains: AltDomains;
  apiUserName: string;
  apiKey: string;
  apiToken: string;
  parameters: GetDomainsParameters;
}

// Export the type definition for the function
export type GetDomainsType = (options: GetDomainsOptions) => Promise<void>;

/**
 * Asynchronously processes domain information and connects to specified IPs.
 *
 * @param {Object} options - The options for the getDomains function.
 * @param {string[]} options.domains - An array of domain names to process.
 * @param {Record<string, string>} options.alt_domains - A mapping of alternative domain names.
 * @param {string} options.apiUserName - The API username for authentication.
 * @param {string} options.apiKey - The API key for authentication.
 * @param {string} options.apiToken - The API token for authentication.
 * @param {Object} options.parameters - Additional parameters for processing.
 * @param {string[]} options.parameters.roomRecvIPs - An array of IPs that are already receiving.
 * @param {Function} options.parameters.consume_sockets - A function to get the latest consume sockets.
 * @param {Function} options.parameters.connectIps - A function to connect to the specified IPs.
 *
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 *
 * @throws Will throw an error if the operation fails.
 */
export const getDomains = async ({
  domains,
  alt_domains,
  apiUserName,
  apiKey,
  apiToken,
  parameters,
}: GetDomainsOptions): Promise<void> => {
  // Destructuring parameters
  let {
    roomRecvIPs,
    consume_sockets,
    connectIps,
  } = parameters;

  const ipsToConnect: string[] = [];

  try {
    // Get the latest consume_sockets
    const updatedParams = parameters.getUpdatedAllParams();
    consume_sockets = updatedParams.consume_sockets;

    // Process each domain
    for (const domain of domains) {
      const ipToCheck = alt_domains[domain] || domain;

      // If the IP is not in roomRecvIPs, add to ipsToConnect
      if (!roomRecvIPs.includes(ipToCheck)) {
        ipsToConnect.push(ipToCheck);
      }
    }

    // Connect to the IPs
    await connectIps({
      consume_sockets,
      remIP: ipsToConnect,
      parameters,
      apiUserName,
      apiKey,
      apiToken,
    });
  } catch (error) {
    console.error('Error in getDomains: ', error);
  }
};
