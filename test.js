import tar from 'tar'
import fs from "fs";
import path from "path";



// 读取tar包中的指定文件
export function readTarFile(
    tarFilePath,
    targetFile,
    encoding = 'utf-8'
) {
    let noTargetFile = false
    let buffer = Buffer.alloc(0)
    tar.list( {
        file: tarFilePath,
        sync: true,
        onentry(entry) {
            const replace = entry.path.replace('./', '')
            if (replace === targetFile) {
                entry.on('data', (data) => {
                    noTargetFile = false
                    buffer = Buffer.concat([buffer, data])
                })
                entry.on('end', () => {
                    console.log('========================end====================')
                });
            }
        },
    }, [targetFile])
    if (noTargetFile) {
        throw new Error(`File ${targetFile} not found in ${tarFilePath}`)
    }
    return buffer.toString(encoding);
}
const tarFile = path.resolve("resource/19145683-09a5-4fc1-9f70-91632152facb.tar");
const tarFileCopy = path.resolve("resource/19145683-09a5-4fc1-9f70-91632152facb-copy.tar");

fs.copyFileSync(tarFile, tarFileCopy)
let info = readTarFile( tarFileCopy, 'info.json');

// true
console.log("file exists:" + fs.existsSync(tarFileCopy))

fs.unlinkSync(tarFileCopy)

//false
// But the file still exists in the file system, until the program exits, the file is truly deleted
console.log("file exists:" + fs.existsSync(tarFileCopy))

setTimeout(() => {
    console.log("exit")
}, 20000)


