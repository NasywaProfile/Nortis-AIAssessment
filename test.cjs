const fs = require('fs');
let content = fs.readFileSync('src/components/cms/CMSDashboard.tsx', 'utf8');
content = content.replace(
  `    if (typeof valID === 'object' && valID !== null) {
      return (
        <div key={path.join('.')} className="mb-6 bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
          <div className="bg-slate-50/50 px-5 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 text-sm">{title}</h3>
          </div>
          <div className="p-5 grid grid-cols-1 gap-4">
            {Object.keys(valID).map(key => (
               <div key={key} className="p-5 bg-white rounded-xl border border-slate-100 shadow-sm">
                 <div className="flex-1 flex flex-col md:flex-row gap-5">
                   {renderInputField('ID', section, [...path, key], valID[key], 'ID')}
                   {renderInputField('EN', section, [...path, key], valEN?.[key] || '', 'EN')}
                 </div>
               </div>
            ))}
          </div>
        </div>
      );
    }`,
  `    if (typeof valID === 'object' && valID !== null) {
      return (
        <div key={path.join('.')} className="mb-6 bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
          <div className="bg-slate-50/50 px-5 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 text-sm">{title}</h3>
          </div>
          <div className="p-5 grid grid-cols-1 gap-4">
            {Object.keys(valID).map(key => (
               <div key={key} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                 {typeof valID[key] === 'object' && valID[key] !== null ? (
                   renderFieldGroup(section, [...path, key], valID[key], valEN?.[key], humanize(key))
                 ) : (
                   <div className="p-5 flex-1 flex flex-col md:flex-row gap-5">
                     {renderInputField('ID', section, [...path, key], valID[key], 'ID')}
                     {renderInputField('EN', section, [...path, key], valEN?.[key] || '', 'EN')}
                   </div>
                 )}
               </div>
            ))}
          </div>
        </div>
      );
    }`
);
fs.writeFileSync('src/components/cms/CMSDashboard.tsx', content);
