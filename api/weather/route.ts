import { NextRequest, NextResponse } from 'next/server';
export const revalidate=0;
export async function GET(req:NextRequest){
 const sp=req.nextUrl.searchParams;const lat=Number(sp.get('lat'));const lon=Number(sp.get('lon'));
 if(!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>90||Math.abs(lon)>180)return NextResponse.json({error:'Valid coordinates are required'},{status:400});
 const unit=sp.get('unit')==='fahrenheit'?'fahrenheit':'celsius';
 const url=new URL('https://api.open-meteo.com/v1/forecast');
 const params:Record<string,string>={latitude:String(lat),longitude:String(lon),current:'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,uv_index',hourly:'temperature_2m,precipitation_probability,relative_humidity_2m,weather_code',daily:'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max',temperature_unit:unit,wind_speed_unit:'kmh',precipitation_unit:'mm',timezone:'auto',forecast_days:'7'};
 Object.entries(params).forEach(([k,v])=>url.searchParams.set(k,v));
 try{const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error('Weather provider error');const data=await r.json();
 return NextResponse.json({place:{name:sp.get('name')||'Selected location',country:sp.get('country')||'',admin1:sp.get('admin')||'',latitude:lat,longitude:lon},current:data.current,daily:data.daily,hourly:data.hourly,timezone:data.timezone,timezone_abbreviation:data.timezone_abbreviation,utc_offset_seconds:data.utc_offset_seconds,units:data.current_units},{headers:{'Cache-Control':'no-store'}});
 }catch{return NextResponse.json({error:'Weather data could not be retrieved. Please retry.'},{status:502});}
}