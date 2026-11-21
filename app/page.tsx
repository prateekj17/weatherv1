  }catch(e:any){setError(e.message||'Unable to load weather.');}finally{setBusy(false);}
 },[unit]);
 useEffect(()=>{if(initialLoad.current)return;initialLoad.current=true;const p={id:0,name:'Delhi',latitude:28.6139,longitude:77.209,country:'India'};load(p)},[load]);
 useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t)},[]);
 useEffect(()=>{if(query.trim().length<2){setSuggestions([]);return;}const t=setTimeout(async()=>{try{const r=await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);const d=await r.json();setSuggestions(d.results||[]);setShowSuggestions(true)}catch{setSuggestions([])}},300);return()=>clearTimeout(t)},[query]);
 const choose=(p:Place)=>load(p);
 const d=weather?.daily;const c=weather?.current;
 const avg=useMemo(()=>{if(!d?.temperature_2m_max)return null;const max=d.temperature_2m_max,min=d.temperature_2m_min;return {high:max.reduce((a:number,b:number)=>a+b,0)/max.length,low:min.reduce((a:number,b:number)=>a+b,0)/min.length,rain:d.precipitation_sum.reduce((a:number,b:number)=>a+b,0),humidity:d.precipitation_probability_max.reduce((a:number,b:number)=>a+b,0)/max.length}},[d]);
 const temp=(n:number)=>`${Math.round(n)}°`;
 const currentCode=c?codeInfo(c.weather_code,c.is_day===1):null;
 const chartStart=weather?.hourly?.time?.findIndex((t:string)=>t>=String(c?.time||'').slice(0,13))??0;
  const chartData=(weather?.hourly?.time||[]).slice(Math.max(0,chartStart),Math.max(0,chartStart)+24).filter((_:string,i:number)=>i%3===0).map((t:string,i:number)=>({time:t.split('T')[1],temp:weather!.hourly.temperature_2m[Math.max(0,chartStart)+i*3]}));
 const useLocation=()=>{if(!navigator.geolocation){setError('Location access is not supported by this browser.');return;}navigator.geolocation.getCurrentPosition(async pos=>{const p={id:0,name:'My location',latitude:pos.coords.latitude,longitude:pos.coords.longitude,country:''};await load(p)},()=>setError('Location permission was not granted.'))};
 return <main className="shell">
  <header className="topbar"><a className="brand" href="#"><span className="brand-mark"><CloudSun size={23}/></span><span>weather<span className="brand-light">IQ</span></span></a><div className="top-actions"><span className="live-dot"/> <span className="muted small">LIVE WEATHER</span><button className="icon-button" onClick={()=>weather&&load(weather.place)} title="Refresh"><RefreshCw size={17} className={busy?'spin':''}/></button></div></header>
  <section className="hero"><div className="eyebrow">WEATHER INTELLIGENCE · GLOBAL FORECAST</div><h1>Know your weather.<br/><span>Plan your day.</span></h1><p className="hero-copy">Real-time conditions and a clearer view of the week ahead, wherever you are.</p>
   <div className="search-wrap"><Search size={19}/><input value={query} onChange={e=>setQuery(e.target.value)} onFocus={()=>setShowSuggestions(true)} onKeyDown={e=>{if(e.key==='Enter'&&suggestions[0])choose(suggestions[0]);if(e.key==='Escape')setShowSuggestions(false)}} placeholder="Search any city in the world..."/><button className="locate" onClick={useLocation}><LocateFixed size={16}/><span>Use my location</span></button>
    {showSuggestions&&suggestions.length>0&&<div className="suggestions">{suggestions.slice(0,7).map(p=><button key={p.id} onClick={()=>choose(p)}><MapPin size={15}/><span>{p.name}{p.admin1?`, ${p.admin1}`:''}</span><small>{p.country}</small></button>)}</div>}
   </div>
  </section>
  {error&&<div className="error">{error}</div>}
  {weather&&c&&d&&<><section className="dashboard-head"><div><div className="location"><MapPin size={16}/>{weather.place.name}{weather.place.admin1?`, ${weather.place.admin1}`:''}{weather.place.country?`, ${weather.place.country}`:''}</div><div className="muted small">Local time · {weather.timezone} ({weather.timezone_abbreviation})</div></div><div className="unit-toggle"><button className={unit==='celsius'?'active':''} onClick={()=>{setUnit('celsius');load(weather.place,'celsius')}}>°C</button><button className={unit==='fahrenheit'?'active':''} onClick={()=>{setUnit('fahrenheit');load(weather.place,'fahrenheit')}}>°F</button></div></section>
   <section className="current-grid"><div className="current-card"><div className="current-top"><div><div className="muted small">CURRENT CONDITIONS</div><div className="current-temp">{temp(c.temperature_2m)}<span>{unit==='celsius'?'C':'F'}</span></div><div className="condition">{currentCode?.label}</div><div className="feels">Feels like {temp(c.apparent_temperature)} · {c.is_day?'Daytime':'Nighttime'}</div></div><div className="weather-illustration">
  {currentCode && (
    <currentCode.Icon size={88} strokeWidth={1.2} />
  )}
</div></div><div className="current-foot"><span><Clock3 size={14}/> Updated {updated?.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</span><span>Model update · Open-Meteo</span></div></div>
    <div className="stats-grid"><Stat icon={Droplets} label="Humidity" value={`${c.relative_humidity_2m}%`} sub="Relative humidity"/><Stat icon={Wind} label="Wind speed" value={`${Math.round(c.wind_speed_10m)} km/h`} sub={`${c.wind_direction_10m}° direction`}/><Stat icon={Gauge} label="Pressure" value={`${Math.round(c.pressure_msl)} hPa`} sub="Sea-level pressure"/><Stat icon={Eye} label="UV index" value={`${c.uv_index??'—'}`} sub="Current UV level"/></div>
   </section>
   <section className="section"><div className="section-heading"><div><div className="eyebrow">THE WEEK AHEAD</div><h2>7-day forecast</h2></div><span className="muted small">Daily outlook · Local dates</span></div><div className="forecast-grid">{d.time.map((day:string,i:number)=>{const info=codeInfo(d.weather_code[i]);return <article className={`day-card ${i===0?'today':''}`} key={day}><div className="day-name">{i===0?'Today':dayName(day)}</div><div className="day-date">{dateLabel(day)}</div><info.Icon className="day-icon" size={31} strokeWidth={1.5}/><div className="day-condition">{info.label}</div><div className="temps"><b>{temp(d.temperature_2m_max[i])}</b><span>{temp(d.temperature_2m_min[i])}</span></div><div className="rain"><Droplets size={13}/>{d.precipitation_probability_max[i]??0}%</div></article>})}</div></section>
   <section className="insight-grid"><div className="panel"><div className="section-heading compact"><div><div className="eyebrow">TEMPERATURE TREND</div><h2>Next 24 hours</h2></div><span className="muted tiny">°{unit==='celsius'?'C':'F'}</span></div><div className="chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData}><defs><linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f3a65b" stopOpacity={0.32}/><stop offset="100%" stopColor="#f3a65b" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 5" stroke="#293445"/><XAxis dataKey="time" tick={{fill:'#8290a3',fontSize:11}} axisLine={false} tickLine={false}/><YAxis tick={{fill:'#8290a3',fontSize:11}} axisLine={false} tickLine={false} width={36}/><Tooltip contentStyle={{background:'#111d2d',border:'1px solid #304056',borderRadius:12}}/><Area type="monotone" dataKey="temp" stroke="#f3a65b" strokeWidth={2.5} fill="url(#tempFill)" name="Temperature"/></AreaChart></ResponsiveContainer></div></div>
    {avg && (
      <div className="panel average-panel">
        <div className="eyebrow">7-DAY CLIMATE SNAPSHOT</div>
        <h2>Weekly averages</h2>
        <div className="average-main"><Thermometer size={23}/><div><strong>{temp((avg.high+avg.low)/2)}</strong><span>Average temperature</span></div></div>
        <div className="average-row"><span>Average daily high</span><b>{temp(avg.high)}</b></div>
        <div className="average-row"><span>Average daily low</span><b>{temp(avg.low)}</b></div>
        <div className="average-row"><span>Average rain chance</span><b>{Math.round(avg.humidity)}%</b></div>
        <div className="average-row"><span>Total expected rainfall</span><b>{avg.rain.toFixed(1)} mm</b></div>
        <p className="tiny muted">Calculated from the displayed 7-day forecast, not a long-term climate normal.</p>
      </div>
    )}
   </section>
   <section className="sun-strip"><div><Sunrise size={22}/><span><small> SUNRISE</small><b>{d.sunrise[0].split('T')[1]}</b></span></div><div><Sunset size={22}/><span><small> SUNSET</small><b>{d.sunset[0].split('T')[1]}</b></span></div><div><Droplets size={22}/><span><small>PRECIPITATION TODAY</small><b>{d.precipitation_sum[0]} mm</b></span></div><div><Wind size={22}/><span><small>MAX WIND</small><b>{Math.round(d.wind_speed_10m_max[0])} km/h</b></span></div></section>
  </>}
  <section className="time-panel"><div className="section-heading compact"><div><div className="eyebrow">GLOBAL TIME REFERENCE</div><h2>Two clocks. One world.</h2></div><Clock3 size={20}/></div><div className="clocks"><div className="clock"><span>GMT / UTC</span><strong>{clock('Etc/UTC',now)}</strong><small>{new Intl.DateTimeFormat('en-GB',{timeZone:'Etc/UTC',dateStyle:'full'}).format(now)}</small><em>UTC +00:00</em></div><div className="clock-divider"/><div className="clock"><span>INDIA STANDARD TIME</span><strong>{clock('Asia/Kolkata',now)}</strong><small>{new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',dateStyle:'full'}).format(now)}</small><em>IST · UTC +05:30</em></div></div><p className="tiny muted">Weather observations and forecast periods follow the selected city's local timezone. GMT and IST clocks update live.</p></section>
  <footer><div className="brand small-brand"><span className="brand-mark"><CloudSun size={18}/></span>weather<span className="brand-light">IQ</span></div><span>Weather data by <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a> · CC BY 4.0</span><span>{updated?`Last fetched ${updated.toLocaleTimeString()}`:'Waiting for weather data'}</span></footer>
 </main>
}
