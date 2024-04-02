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
            await Promise.all(files.map(async file => {
                console.log(`Deleting file: ${path.join(expandedDir, file)}`);
                await fs.promises.unlink(path.join(expandedDir, file));
                console.log(`Successfully deleted file: ${path.join(expandedDir, file)}`);
            }));
            console.log(`Successfully cleaned up directory: ${expandedDir}`);
        } catch (err) {
            console.error(`Error cleaning up directory ${expandedDir}:`, err);
        }
    }
}

cron.schedule(" 0 0 1 * *", doCleanup(), {
    scheduled: true
});
