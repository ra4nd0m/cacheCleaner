const fs = require('fs');
const path = require('path');
const os = require('os');
const cron = require('node-cron');

const dirs = ["~/app/shared/var/cache/charts", "~/app/shared/var/cache/reports/weekly", "~/app/shared/var/cache/reports/monthly"];


function expandPath(dir) {
    return dir.replace('~', os.homedir());
}

async function doCleanup() {
    for (const dir of dirs) {
        const expandedDir = expandPath(dir);
        try {
            const files = await fs.promises.readdir(expandedDir);
            await Promise.all(files.map(file => fs.promises.unlink(path.join(expandedDir, file))));
        } catch (err) {
            console.error(`Error cleaning up directory ${expandedDir}:`, err);
        }
    }
}

cron.schedule(" 0 0 1 * *", doCleanup(), {
    scheduled: true
});
