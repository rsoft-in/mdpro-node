function buildFilter(field, value) {
    if (!value) return '';

    let filt = "";
    let filtAND = "";
    let filtOR = "";

    // Convert value to string in case a number is passed
    let valStr = String(value);

    // Remove trailing comma if present
    if (valStr.endsWith(',')) {
        valStr = valStr.slice(0, -1);
    }

    const aflt = valStr.split(',');

    for (let i = 0; i < aflt.length; i++) {
        const item = aflt[i];

        if (item.includes('-')) {
            const cleanVal = item.replace(/-/g, '').trim();
            filtAND += ` AND (${field} NOT LIKE '${cleanVal}%')`;
        } else if (item.includes('*')) {
            const cleanVal = item.replace(/\*/g, '').trim();
            if (cleanVal !== '') {
                filtOR += ` OR (${field} LIKE '%${cleanVal}%')`;
            }
        } else {
            const cleanVal = item.trim();
            filtOR += ` OR (${field} = '${cleanVal}')`;
        }
    }

    filt += filtAND + (filtOR !== '' ? ` AND (1=0 ${filtOR})` : '');

    return filt;
}

function convertDate_DE_UN(dt) {
    if (!dt) {
        return null;
    }
    return `${dt.substring(6, 10)}-${dt.substring(3, 5)}-${dt.substring(0, 2)}`;
}

module.exports = {
    buildFilter, convertDate_DE_UN
}