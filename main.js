const axios = require("axios");
const fs = require("fs");

const __client_id = "";
const _uid = "";

function parse(html) {
    return JSON.parse(decodeURIComponent(/window._feInjection = JSON.parse\(decodeURIComponent\(\"([^\"$]*)\"\)\);/.exec(html)[1]));
}

function getPassed(uid) {
    return new Promise((resolve) => {
        axios("https://www.luogu.com.cn/user/" + uid).then((res) => {
            let data = parse(res.data)["currentData"]["passedProblems"];
            let list = [];
            for (let i = 0; i < data.length; i++) {
                list[list.length] = data[i]["pid"];
            }
            resolve(list);
        }).catch((err) => {
            throw (err);
        });
    });
}

function getCode(pid) {
    return new Promise((resolve) => {
        axios({
            method: "GET",
            url: "https://www.luogu.com.cn/problem/" + pid,
            headers: {
                "Cookie": "__client_id=" + __client_id + "; _uid=" + _uid
            }
        }).then((res) => {
            let code = parse(res.data)["currentData"]["lastCode"];;
            resolve(code);
        }).catch((err) => {
            throw (err);
        });
    });
}

async function main() {
    let list = await getPassed(_uid);
    for (let i = 0; i < list.length; i++) {
        let code = await getCode(list[i]);
        if (code == undefined) {
            console.log(list[i] + " ERROR.");
            continue;
        }
        fs.writeFileSync("./code/" + list[i] + ".cpp", code);
        console.log(list[i] + " OK.");
    }
}

main();
