export interface SandboxData {
	affilliate: string;
	amount:number;
	billing_address : {
		country: string,
		postcode: string,
		region?: string,
		street_line_1?: string ,
		street_line_2?:string,
		town?:string
	};
	currency:number;
	customer:{
		email:string,
		first_name:string,
		last_name:string,
		phone:string,
	},
	frequency:string,
	is_recurring?:boolean,
	merchant_id:string,
	options:{
		is_subscribed_address: boolean,
		is_subscribed_email: boolean,
		is_subscribed_phone: boolean,
	},
	qty:number,
	service:string
}