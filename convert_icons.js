const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, 'icons');
const outputFile = path.join(__dirname, 'icons_base64.json');

const filesToConvert = [
    { name: 'website', file: 'globe_6387919.png' },
    { name: 'email', file: 'mail_7699147.png' },
    { name: 'mobile', file: 'telephone_8924533.png' }, // Using telephone for mobile
    { name: 'phone', file: 'telephone_8924533.png' },   // Using same for phone
    { name: 'facebook', file: 'facebook_3488299.png' },
    { name: 'instagram', file: 'instagram_2673885.png' },
    { name: 'linkedin', file: 'linkedin-letters_25325.png' }
];

const results = {};

filesToConvert.forEach(item => {
    const filePath = path.join(iconsDir, item.file);
    if (fs.existsSync(filePath)) {
        const bitmap = fs.readFileSync(filePath);
        const base64 = Buffer.from(bitmap).toString('base64');
        results[item.name] = `data:image/png;base64,${base64}`;
        console.log(`Converted ${item.name}`);
    } else {
        console.log(`File not found: ${filePath}`);
    }
});

fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
console.log(`Saved to ${outputFile}`);
