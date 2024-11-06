import { defineOperationApi } from '@directus/extensions-sdk';
import type { Accountability } from '@directus/types';
// FIXME: getAccountabilityForRole is not exported yet by directus utils
// https://github.com/directus/directus/discussions/5820
// import { getAccountabilityForRole } from '@directus/utils';
import axios from 'axios';
import { isAxiosError } from 'axios';
import { fromBuffer } from "pdf2pic";
import { Readable } from 'stream';

type Options = {
	url: string;
	fileName: string;
	format: string,
	quality: number,
	density: number,
	width: number,
	folder?: string;
	headers?: { header: string; value: string }[] | null;
	permissions?: string; // target is $public, $trigger, $full, or UUID of a role
	storage?: string;
};

export default defineOperationApi<Options>({
	id: 'euryecetelecom-pdf2img',
	handler: async ({ url, fileName, format, quality, density, width, folder, storage, headers, permissions }, { accountability, database, getSchema, logger, services }) => {
		let fixedDefaultFormat = format ?? 'png';
		let fixedDefaultQuality = quality ?? 90;
		let fixedDefaultDensity = density ?? 90;
		let fixedDefaultWidth = width ?? 3840;
		const customHeaders = headers?.reduce(
			(acc, { header, value }) => {
				acc[header] = value;
				return acc;
			},
			{} as Record<string, string>,
		) ?? {};

		let customAccountability: Accountability | null;
		if (!permissions || permissions === '$trigger') {
			customAccountability = accountability;
		} else if (permissions === '$full') {
			customAccountability = {
				user: null,
				role: null,
				admin: true,
				app: true,
				permissions: [],
			};
		} else {
			logger.error("Unsupported permission specified: " + permissions);
			throw "Unsupported permission specified: " + permissions;
		}

		const schema = await getSchema({ database });
		let filesService = new services.FilesService({
			knex: database,
			schema: schema,
			accountability: customAccountability,
		});

		let customStorage = 'local';
		if(storage && storage != ''){
			customStorage = storage;
		}
		let primaryKeys = <string[]>[];
		let errorDetected = false;
		let errorMessage = '';
		try {
			const pdf = await axios({
				url: url,
				headers: customHeaders,
				responseType: 'arraybuffer',
			})

			let options = {
				format: fixedDefaultFormat,
				quality: fixedDefaultQuality,
				density: fixedDefaultDensity,
				width: fixedDefaultWidth, //Number in px
				// TODO: ADD MORE OPTIONS EXPOSED TO OPERATION CONF (cf https://github.com/yakovmeister/pdf2image#options) + specific pages to be converted
				preserveAspectRatio: true,
				// height: 100 // Number in px
			};
			await fromBuffer(pdf.data, options).bulk(-1, {responseType: 'buffer'}).then(async (resolve) => {
				if(resolve && resolve.length > 0){
					for(let page of resolve){
						if(page.buffer){
							let title = fileName + String(page.page).padStart(String(resolve.length).length, '0') + '.' + fixedDefaultFormat;
							let metaData = {
								filename_download: title,
								folder: folder,
								storage: customStorage,
								title: title,
								type: 'image/' + fixedDefaultFormat,
							};
							let primaryKey = await filesService.uploadOne(Readable.from(page.buffer), metaData);
							if(!primaryKey){
								throw("No response from Directus Upload / Store operation");
							} else {
								primaryKeys.push(primaryKey);
							}
						} else {
							throw("Empty conversion buffer");
						}
					}
				} else {
					throw("Empty conversion response");
				}
			})
		} catch(error: unknown){
			if (isAxiosError(error) && error.response) {
				throw JSON.stringify({
					status: error.response.status,
					statusText: error.response.statusText,
					headers: error.response.headers,
					data: error.response.data,
				});
			} else {
				console.error(`directus-extension-pdf2img-operation:`, error);
				throw error;
			}
		}
		if(errorDetected){
			throw(errorMessage);
		} else {
			return primaryKeys;
		}
	},
});
