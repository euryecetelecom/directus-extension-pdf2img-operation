import { defineOperationApp } from '@directus/extensions-sdk';

export default defineOperationApp({
	id: 'euryecetelecom-pdf2img',
	name: 'Convert a PDF to images and store files',
	icon: 'box',
	description: 'Download a PDF from an URL, convert it to images and store them',
	overview: ({ url, fileName }) => [
		{
			label: '$t:operations.request.url',
			text: url,
		}, {
			label: 'Root file name',
			text: fileName,
		},
	],
	options: [
		{
			field: 'url',
			name: '$t:operations.request.url',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'input',
				options: {
					placeholder: 'https://example.com/myFileURI',
				},
			},
		},{
			field: 'fileName',
			name: 'Root file name',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'input',
				options: {
					placeholder: 'MyFileName',
				},
			},
		},{
			field: 'format',
			name: 'Image format',
			type: 'string',
			schema: {
				default_value: 'png',
			},
			meta: {
				width: 'half',
				interface: 'select-dropdown',
				options: {
					choices: [
						{
							text: 'JPEG',
							value: 'jpeg',
						},
						{
							text: 'PNG',
							value: 'png',
						},
					],
					allowOther: false,
				}
			},
		},{
			field: 'quality',
			name: 'Image quality (0 -> 100)',
			type: 'number',
			schema: {
				default_value: 90
			},
			meta: {
				width: 'half',
				interface: 'input',
			},
		},{
			field: 'density',
			name: 'Image density (DPI)',
			type: 'number',
			schema: {
				default_value: 90
			},
			meta: {
				width: 'half',
				interface: 'input',
			},
		},{
			field: 'width',
			name: 'Image width (pixels)',
			type: 'number',
			schema: {
				default_value: 3840
			},
			meta: {
				width: 'half',
				interface: 'input',
			},
		},{
			field: 'folder',
			name: '$t:folder',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'system-folder',
			},
		},{
			field: 'storage',
			name: 'Storage adapter (local by default)',
			type: 'string',
			meta: {
				width: 'half',
			},
		},{
			field: 'headers',
			name: '$t:operations.request.headers',
			type: 'json',
			meta: {
				width: 'full',
				interface: 'list',
				options: {
					fields: [
						{
							field: 'header',
							name: '$t:operations.request.header',
							type: 'string',
							meta: {
								width: 'half',
								interface: 'input',
								required: true,
								options: {
									placeholder: '$t:operations.request.header_placeholder',
								},
							},
						},
						{
							field: 'value',
							name: '$t:value',
							type: 'string',
							meta: {
								width: 'half',
								interface: 'input',
								required: true,
								options: {
									placeholder: '$t:operations.request.value_placeholder',
								},
							},
						},
					],
				},
			},
		},{
			field: 'permissions',
			name: '$t:permissions',
			type: 'string',
			schema: {
				default_value: '$trigger',
			},
			meta: {
				width: 'half',
				interface: 'select-dropdown',
				options: {
					choices: [
						{
							text: 'From Trigger',
							value: '$trigger',
						},
						// {
						// 	text: 'Public Role',
						// 	value: '$public',
						// },
						{
							text: 'Full Access',
							value: '$full',
						},
					],
					// allowOther: true,
					allowOther: false,
				},
			},
		},
	],
});
