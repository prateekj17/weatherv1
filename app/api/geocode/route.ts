import { NextRequest, NextResponse } from 'next/server';
export async function GET(req:NextRequest){
 const q=req.nextUrl.searchParams.get('q')?.trim();
 if(!q||q.length<2)return NextResponse.json({results:[]});
 try{
  const url=new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.searchParams.set('name',q);url.searchParams.set('count','8');url.searchParams.set('language','en');url.searchParams.set('format','json');
  const response=await fetch(url,{next:{revalidate:3600}});
  if(!response.ok)throw new Error('Geocoding unavailable');
  const data=await response.json();
  return NextResponse.json({results:(data.results||[]).map((p:any)=>({id:p.id,name:p.name,latitude:p.latitude,longitude:p.longitude,country:p.country,admin1:p.admin1,timezone:p.timezone}))});
 }catch{return NextResponse.json({error:'Could not search locations',results:[]},{status:502});}
}