const BRAWL_API_ENDPOINT = "https://api.brawlstars.com/v1/";
const playerTagEX = "#YCQLVQV";
const playerTagEX2 = "#LR2PV2J2"
import { config } from "dotenv";
config();
export const brawlRecentBattle = async (battletag: string) => {
    const newBattletag = battletag.substring(1);
    const result = await fetch(BRAWL_API_ENDPOINT + 'players/%23' + newBattletag + '/battlelog', {
        headers: {
            "Authorization": "Bearer " + process.env.BRAWL_API_KEY,
            "Content-Type": "application/json"
        }
    });
    if (result.status !== 200) {
        console.log(result.status);
        return;
    }
    const json = await result.json();
    console.log(json);
};
export const brawlInfo = async (battletag: string) => {
    const newBattletag = battletag.substring(1);
    const result = await fetch(BRAWL_API_ENDPOINT + 'players/%23' + newBattletag, {
        headers: {
            "Authorization": "Bearer " + process.env.BRAWL_API_KEY,
            "Content-Type": "application/json"
        }
    });
    if (result.status !== 200) {
        console.log(result.status);
        return;
    }
    const userData = await result.json();
    const user = {
        tag: userData.tag,
        name: userData.name,
        trophies: userData.trophies,
        highestTrophies: userData.highestTrophies,
        '3vs3Victories': userData['3vs3Victories'],
        soloVictories: userData.soloVictories,
        duoVictories: userData.duoVictories
    };
    const sortByTrophies= userData.brawlers.sort((a, b) => b.trophies - a.trophies);
    const topBrawlersByTrophies = sortByTrophies.slice(0, 10);
    const brawlers = topBrawlersByTrophies.sort((a, b) => b.highestTrophies - a.highestTrophies).slice(0, 3).map(brawler => ({
        id: brawler.id,
        name: brawler.name,
        power: brawler.power,
        gears: brawler.gears,
        trophies: brawler.trophies,
        highestTrophies: brawler.highestTrophies,
        starPowers: brawler.starPowers,
        gadgets: brawler.gadgets
    }));
    const iconId = userData.icon.id;
    const imgID = "https://media.brawltime.ninja/avatars/" + iconId + ".webp?size=200";
    return { user, imgID, brawlers } ;
};

const JSON = {
    "items": [
      {
        "battleTime": "20240404T100915.000Z",
        "event": {
          "id": 15000137,
          "mode": "heist",
          "map": "Pit Stop"
        },
        "battle": {
          "mode": "heist",
          "type": "soloRanked",
          "result": "victory",
          "duration": 51,
          "starPlayer": {
            "tag": "#8RJQ8RLUV",
            "name": "Piova05",
            "brawler": {
              "id": 16000006,
              "name": "BARLEY",
              "power": 11,
              "trophies": 2
            }
          },
          "teams": [
            [
              {
                "tag": "#8C800LQLQ",
                "name": "jorge€€€€€€",
                "brawler": {
                  "id": 16000026,
                  "name": "BIBI",
                  "power": 11,
                  "trophies": 2
                }
              },
              {
                "tag": "#20QY9U8RJ",
                "name": "Kumi_YT",
                "brawler": {
                  "id": 16000009,
                  "name": "DYNAMIKE",
                  "power": 9,
                  "trophies": 2
                }
              },
              {
                "tag": "#8L2QJ2RQ9",
                "name": "CROW.SK8._.",
                "brawler": {
                  "id": 16000012,
                  "name": "CROW",
                  "power": 10,
                  "trophies": 2
                }
              }
            ],
            [
              {
                "tag": "#8CVUQ9U0J",
                "name": "kek",
                "brawler": {
                  "id": 16000008,
                  "name": "NITA",
                  "power": 10,
                  "trophies": 2
                }
              },
              {
                "tag": "#YCQLVQV",
                "name": "Supersan_jlv",
                "brawler": {
                  "id": 16000077,
                  "name": "LARRY & LAWRIE",
                  "power": 10,
                  "trophies": 2
                }
              },
              {
                "tag": "#8RJQ8RLUV",
                "name": "Piova05",
                "brawler": {
                  "id": 16000006,
                  "name": "BARLEY",
                  "power": 11,
                  "trophies": 2
                }
              }
            ]
          ]
        }
      },
      {
        "battleTime": "20240404T100732.000Z",
        "event": {
          "id": 15000368,
          "mode": "knockout",
          "map": "Belle's Rock"
        },
        "battle": {
          "mode": "knockout",
          "type": "soloRanked",
          "result": "victory",
          "duration": 52,
          "starPlayer": {
            "tag": "#YCQLVQV",
            "name": "Supersan_jlv",
            "brawler": {
              "id": 16000077,
              "name": "LARRY & LAWRIE",
              "power": 10,
              "trophies": 2
            }
          },
          "teams": [
            [
              {
                "tag": "#YCQLVQV",
                "name": "Supersan_jlv",
                "brawler": {
                  "id": 16000077,
                  "name": "LARRY & LAWRIE",
                  "power": 10,
                  "trophies": 2
                }
              },
              {
                "tag": "#2Q89QG8U8",
                "name": "jakov200_7",
                "brawler": {
                  "id": 16000061,
                  "name": "GUS",
                  "power": 11,
                  "trophies": 2
                }
              },
              {
                "tag": "#2J8PGR029",
                "name": "billieeilish",
                "brawler": {
                  "id": 16000009,
                  "name": "DYNAMIKE",
                  "power": 9,
                  "trophies": 2
                }
              }
            ],
            [
              {
                "tag": "#89VVP09L9",
                "name": "Vanesa",
                "brawler": {
                  "id": 16000000,
                  "name": "SHELLY",
                  "power": 10,
                  "trophies": 470
                }
              },
              {
                "tag": "#PUGJV9U2V",
                "name": "bilal stars",
                "brawler": {
                  "id": 16000073,
                  "name": "CHUCK",
                  "power": 9,
                  "trophies": 456
                }
              },
              {
                "tag": "#Q082JJLP9",
                "name": "Dragonslayer",
                "brawler": {
                  "id": 16000045,
                  "name": "STU",
                  "power": 11,
                  "trophies": 463
                }
              }
            ]
          ]
        }
      },
      {
        "battleTime": "20240404T100550.000Z",
        "event": {
          "id": 15000306,
          "mode": "hotZone",
          "map": "Dueling Beetles"
        },
        "battle": {
          "mode": "hotZone",
          "type": "soloRanked",
          "result": "defeat",
          "duration": 119,
          "starPlayer": {
            "tag": "#Y29Y9R89Q",
            "name": "BABA FİNGO",
            "brawler": {
              "id": 16000026,
              "name": "BIBI",
              "power": 11,
              "trophies": 2
            }
          },
          "teams": [
            [
              {
                "tag": "#RJ2P99RC",
                "name": "francisco",
                "brawler": {
                  "id": 16000043,
                  "name": "EDGAR",
                  "power": 11,
                  "trophies": 2
                }
              },
              {
                "tag": "#R8GLQ0Q0V",
                "name": "Axel Schwitzer",
                "brawler": {
                  "id": 16000049,
                  "name": "BUZZ",
                  "power": 9,
                  "trophies": 2
                }
              },
              {
                "tag": "#Y29Y9R89Q",
                "name": "BABA FİNGO",
                "brawler": {
                  "id": 16000026,
                  "name": "BIBI",
                  "power": 11,
                  "trophies": 2
                }
              }
            ],
            [
              {
                "tag": "#YC8RRR09G",
                "name": "Fortnite lukas",
                "brawler": {
                  "id": 16000023,
                  "name": "LEON",
                  "power": 11,
                  "trophies": 2
                }
              },
              {
                "tag": "#2UYGYJ902",
                "name": "༼ つ ◕_◕ ༽つ",
                "brawler": {
                  "id": 16000005,
                  "name": "SPIKE",
                  "power": 11,
                  "trophies": 2
                }
              },
              {
                "tag": "#YCQLVQV",
                "name": "Supersan_jlv",
                "brawler": {
                  "id": 16000012,
                  "name": "CROW",
                  "power": 11,
                  "trophies": 2
                }
              }
            ]
          ]
        }
      },
      {
        "battleTime": "20240404T100309.000Z",
        "event": {
          "id": 15000548,
          "mode": "knockout",
          "map": "Out in the Open"
        },
        "battle": {
          "mode": "knockout",
          "type": "soloRanked",
          "result": "defeat",
          "duration": 89,
          "starPlayer": {
            "tag": "#2Y0GP8229",
            "name": "《IVANMIRAJLC》",
            "brawler": {
              "id": 16000015,
              "name": "PIPER",
              "power": 9,
              "trophies": 2
            }
          },
          "teams": [
            [
              {
                "tag": "#2Y0GP8229",
                "name": "《IVANMIRAJLC》",
                "brawler": {
                  "id": 16000015,
                  "name": "PIPER",
                  "power": 9,
                  "trophies": 2
                }
              },
              {
                "tag": "#PP99JY9L",
                "name": "💓morsi",
                "brawler": {
                  "id": 16000043,
                  "name": "EDGAR",
                  "power": 11,
                  "trophies": 2
                }
              },
              {
                "tag": "#YQYR80QQ",
                "name": "BOGDAN",
                "brawler": {
                  "id": 16000023,
                  "name": "LEON",
                  "power": 11,
                  "trophies": 2
                }
              }
            ],
            [
              {
                "tag": "#YCQLVQV",
                "name": "Supersan_jlv",
                "brawler": {
                  "id": 16000012,
                  "name": "CROW",
                  "power": 11,
                  "trophies": 2
                }
              },
              {
                "tag": "#PQVQYG8CL",
                "name": "kamil",
                "brawler": {
                  "id": 16000043,
                  "name": "EDGAR",
                  "power": 10,
                  "trophies": 2
                }
              },
              {
                "tag": "#Q9LY9G9QR",
                "name": "тилипузик",
                "brawler": {
                  "id": 16000005,
                  "name": "SPIKE",
                  "power": 11,
                  "trophies": 2
                }
              }
            ]
          ]
        }
      },
      {
        "battleTime": "20240404T100043.000Z",
        "event": {
          "id": 15000072,
          "mode": "heist",
          "map": "Bridge Too Far"
        },
        "battle": {
          "mode": "heist",
          "type": "soloRanked",
          "result": "victory",
          "duration": 67,
          "starPlayer": {
            "tag": "#8VPLCYV0P",
            "name": "Б_О_Р_С_У_К",
            "brawler": {
              "id": 16000007,
              "name": "JESSIE",
              "power": 11,
              "trophies": 2
            }
          },
          "teams": [
            [
              {
                "tag": "#2V88PQJLY",
                "name": "ciamcimek",
                "brawler": {
                  "id": 16000009,
                  "name": "DYNAMIKE",
                  "power": 11,
                  "trophies": 2
                }
              },
              {
                "tag": "#88CLYP8Y8",
                "name": "RIP YOU!!!!!!!!",
                "brawler": {
                  "id": 16000039,
                  "name": "COLETTE",
                  "power": 11,
                  "trophies": 2
                }
              },
              {
                "tag": "#GU8GJ0QRU",
                "name": "G.O.A.T",
                "brawler": {
                  "id": 16000005,
                  "name": "SPIKE",
                  "power": 9,
                  "trophies": 2
                }
              }
            ],
            [
              {
                "tag": "#YCQLVQV",
                "name": "Supersan_jlv",
                "brawler": {
                  "id": 16000041,
                  "name": "LOU",
                  "power": 11,
                  "trophies": 2
                }
              },
              {
                "tag": "#8VPLCYV0P",
                "name": "Б_О_Р_С_У_К",
                "brawler": {
                  "id": 16000007,
                  "name": "JESSIE",
                  "power": 11,
                  "trophies": 2
                }
              },
              {
                "tag": "#8JV0GV28G",
                "name": "Ворон",
                "brawler": {
                  "id": 16000039,
                  "name": "COLETTE",
                  "power": 11,
                  "trophies": 2
                }
              }
            ]
          ]
        }
      },
      {
        "battleTime": "20240404T095721.000Z",
        "event": {
          "id": 15000548,
          "mode": "knockout",
          "map": "Out in the Open"
        },
        "battle": {
          "mode": "knockout",
          "type": "soloRanked",
          "result": "victory",
          "duration": 49,
          "starPlayer": {
            "tag": "#YCQLVQV",
            "name": "Supersan_jlv",
            "brawler": {
              "id": 16000012,
              "name": "CROW",
              "power": 11,
              "trophies": 2
            }
          },
          "teams": [
            [
              {
                "tag": "#YCQLVQV",
                "name": "Supersan_jlv",
                "brawler": {
                  "id": 16000012,
                  "name": "CROW",
                  "power": 11,
                  "trophies": 2
                }
              },
              {
                "tag": "#2P2PCVYQ8",
                "name": "SinKi",
                "brawler": {
                  "id": 16000014,
                  "name": "BO",
                  "power": 9,
                  "trophies": 2
                }
              },
              {
                "tag": "#GR80RCGQL",
                "name": "ez",
                "brawler": {
                  "id": 16000023,
                  "name": "LEON",
                  "power": 11,
                  "trophies": 2
                }
              }
            ],
            [
              {
                "tag": "#YJR92Y2VL",
                "name": "Philipp sw",
                "brawler": {
                  "id": 16000043,
                  "name": "EDGAR",
                  "power": 11,
                  "trophies": 2
                }
              },
              {
                "tag": "#RYL2RJYJV",
                "name": "gigamom12",
                "brawler": {
                  "id": 16000015,
                  "name": "PIPER",
                  "power": 9,
                  "trophies": 2
                }
              },
              {
                "tag": "#RCPYLCPP",
                "name": "goni",
                "brawler": {
                  "id": 16000026,
                  "name": "BIBI",
                  "power": 11,
                  "trophies": 2
                }
              }
            ]
          ]
        }
      },
      {
        "battleTime": "20240404T095543.000Z",
        "event": {
          "id": 15000368,
          "mode": "knockout",
          "map": "Belle's Rock"
        },
        "battle": {
          "mode": "knockout",
          "type": "soloRanked",
          "result": "victory",
          "duration": 46,
          "starPlayer": {
            "tag": "#8RPGC9URL",
            "name": "Xander",
            "brawler": {
              "id": 16000023,
              "name": "LEON",
              "power": 11,
              "trophies": 2
            }
          },
          "teams": [
            [
              {
                "tag": "#Q89R9QYQU",
                "name": "🇵🇸🇵🇸🔛🔝",
                "brawler": {
                  "id": 16000010,
                  "name": "EL PRIMO",
                  "power": 9,
                  "trophies": 2
                }
              },
              {
                "tag": "#C9PUPU8U9",
                "name": "COLT",
                "brawler": {
                  "id": 16000008,
                  "name": "NITA",
                  "power": 9,
                  "trophies": 2
                }
              },
              {
                "tag": "#9UUUULULQ",
                "name": "CagoPacito",
                "brawler": {
                  "id": 16000022,
                  "name": "TICK",
                  "power": 10,
                  "trophies": 2
                }
              }
            ],
            [
              {
                "tag": "#YCQLVQV",
                "name": "Supersan_jlv",
                "brawler": {
                  "id": 16000077,
                  "name": "LARRY & LAWRIE",
                  "power": 10,
                  "trophies": 2
                }
              },
              {
                "tag": "#8RPGC9URL",
                "name": "Xander",
                "brawler": {
                  "id": 16000023,
                  "name": "LEON",
                  "power": 11,
                  "trophies": 2
                }
              },
              {
                "tag": "#PP28URCQR",
                "name": "waseem",
                "brawler": {
                  "id": 16000015,
                  "name": "PIPER",
                  "power": 11,
                  "trophies": 2
                }
              }
            ]
          ]
        }
      },
      {
        "battleTime": "20240404T095306.000Z",
        "event": {
          "id": 15000300,
          "mode": "hotZone",
          "map": "Ring of Fire"
        },
        "battle": {
          "mode": "hotZone",
          "type": "soloRanked",
          "result": "victory",
          "duration": 82,
          "starPlayer": {
            "tag": "#PYY09V9RQ",
            "name": "ower",
            "brawler": {
              "id": 16000009,
              "name": "DYNAMIKE",
              "power": 11,
              "trophies": 1
            }
          },
          "teams": [
            [
              {
                "tag": "#YQ0VG29U8",
                "name": "Діма Коляденко",
                "brawler": {
                  "id": 16000043,
                  "name": "EDGAR",
                  "power": 10,
                  "trophies": 1
                }
              },
              {
                "tag": "#PYY09V9RQ",
                "name": "ower",
                "brawler": {
                  "id": 16000009,
                  "name": "DYNAMIKE",
                  "power": 11,
                  "trophies": 1
                }
              },
              {
                "tag": "#YCQLVQV",
                "name": "Supersan_jlv",
                "brawler": {
                  "id": 16000012,
                  "name": "CROW",
                  "power": 11,
                  "trophies": 1
                }
              }
            ],
            [
              {
                "tag": "#UU0CVGUV8",
                "name": "faousa katsari",
                "brawler": {
                  "id": 16000014,
                  "name": "BO",
                  "power": 10,
                  "trophies": 1
                }
              },
              {
                "tag": "#90LGJQJ9U",
                "name": "✨✨✨",
                "brawler": {
                  "id": 16000015,
                  "name": "PIPER",
                  "power": 9,
                  "trophies": 1
                }
              },
              {
                "tag": "#GQC9QV90V",
                "name": "♎женя♎",
                "brawler": {
                  "id": 16000005,
                  "name": "SPIKE",
                  "power": 9,
                  "trophies": 1
                }
              }
            ]
          ]
        }
      },
      {
        "battleTime": "20240404T095102.000Z",
        "event": {
          "id": 15000118,
          "mode": "brawlBall",
          "map": "Pinball Dreams"
        },
        "battle": {
          "mode": "brawlBall",
          "type": "soloRanked",
          "result": "victory",
          "duration": 117,
          "starPlayer": {
            "tag": "#JRG9JGUYC",
            "name": "helmutder1",
            "brawler": {
              "id": 16000005,
              "name": "SPIKE",
              "power": 9,
              "trophies": 1
            }
          },
          "teams": [
            [
              {
                "tag": "#YCQLVQV",
                "name": "Supersan_jlv",
                "brawler": {
                  "id": 16000049,
                  "name": "BUZZ",
                  "power": 11,
                  "trophies": 1
                }
              },
              {
                "tag": "#JRG9JGUYC",
                "name": "helmutder1",
                "brawler": {
                  "id": 16000005,
                  "name": "SPIKE",
                  "power": 9,
                  "trophies": 1
                }
              },
              {
                "tag": "#Q8JYQJPV",
                "name": "airbear",
                "brawler": {
                  "id": 16000019,
                  "name": "PENNY",
                  "power": 9,
                  "trophies": 1
                }
              }
            ],
            [
              {
                "tag": "#9L90UJG9R",
                "name": "pur",
                "brawler": {
                  "id": 16000071,
                  "name": "DOUG",
                  "power": 10,
                  "trophies": 438
                }
              },
              {
                "tag": "#QG0LVLPJQ",
                "name": "Br00klynGamerCT",
                "brawler": {
                  "id": 16000016,
                  "name": "PAM",
                  "power": 10,
                  "trophies": 450
                }
              },
              {
                "tag": "#GL0CCGLLQ",
                "name": "ba",
                "brawler": {
                  "id": 16000014,
                  "name": "BO",
                  "power": 10,
                  "trophies": 452
                }
              }
            ]
          ]
        }
      },
      {
        "battleTime": "20240404T094759.000Z",
        "event": {
          "id": 15000294,
          "mode": "hotZone",
          "map": "Split"
        },
        "battle": {
          "mode": "hotZone",
          "type": "soloRanked",
          "result": "victory",
          "duration": 82,
          "starPlayer": {
            "tag": "#YCQLVQV",
            "name": "Supersan_jlv",
            "brawler": {
              "id": 16000077,
              "name": "LARRY & LAWRIE",
              "power": 10,
              "trophies": 1
            }
          },
          "teams": [
            [
              {
                "tag": "#YCQLVQV",
                "name": "Supersan_jlv",
                "brawler": {
                  "id": 16000077,
                  "name": "LARRY & LAWRIE",
                  "power": 10,
                  "trophies": 1
                }
              },
              {
                "tag": "#Y298UCJ2",
                "name": "EFSANE",
                "brawler": {
                  "id": 16000012,
                  "name": "CROW",
                  "power": 11,
                  "trophies": 1
                }
              },
              {
                "tag": "#LLPQURJ2G",
                "name": "Mongraal",
                "brawler": {
                  "id": 16000043,
                  "name": "EDGAR",
                  "power": 11,
                  "trophies": 1
                }
              }
            ],
            [
              {
                "tag": "#2GPV2UCRR",
                "name": "°At_Last°×",
                "brawler": {
                  "id": 16000063,
                  "name": "CHESTER",
                  "power": 11,
                  "trophies": 582
                }
              },
              {
                "tag": "#GV2QGCURV",
                "name": "лидер",
                "brawler": {
                  "id": 16000008,
                  "name": "NITA",
                  "power": 11,
                  "trophies": 590
                }
              },
              {
                "tag": "#JP2VC9Q9Y",
                "name": "yaagzrmkc",
                "brawler": {
                  "id": 16000013,
                  "name": "POCO",
                  "power": 10,
                  "trophies": 577
                }
              }
            ]
          ]
        }
      },
      {
        "battleTime": "20240404T094553.000Z",
        "event": {
          "id": 15000072,
          "mode": "heist",
          "map": "Bridge Too Far"
        },
        "battle": {
          "mode": "heist",
          "type": "soloRanked",
          "result": "victory",
          "duration": 90,
          "starPlayer": {
            "tag": "#9LPVURPLR",
            "name": "Blackmore",
            "brawler": {
              "id": 16000001,
              "name": "COLT",
              "power": 9,
              "trophies": 1
            }
          },
          "teams": [
            [
              {
                "tag": "#9LPVURPLR",
                "name": "Blackmore",
                "brawler": {
                  "id": 16000001,
                  "name": "COLT",
                  "power": 9,
                  "trophies": 1
                }
              },
              {
                "tag": "#YCQLVQV",
                "name": "Supersan_jlv",
                "brawler": {
                  "id": 16000012,
                  "name": "CROW",
                  "power": 11,
                  "trophies": 1
                }
              },
              {
                "tag": "#LGG08CJYJ",
                "name": "dabi",
                "brawler": {
                  "id": 16000009,
                  "name": "DYNAMIKE",
                  "power": 9,
                  "trophies": 1
                }
              }
            ],
            [
              {
                "tag": "#QCU2V9L2Q",
                "name": "matheo5",
                "brawler": {
                  "id": 16000061,
                  "name": "GUS",
                  "power": 8,
                  "trophies": 539
                }
              },
              {
                "tag": "#UCYYP2UVQ",
                "name": "TG: @gljump",
                "brawler": {
                  "id": 16000077,
                  "name": "LARRY & LAWRIE",
                  "power": 9,
                  "trophies": 545
                }
              },
              {
                "tag": "#C2G0LG2CQ",
                "name": "tg @SCRE1",
                "brawler": {
                  "id": 16000016,
                  "name": "PAM",
                  "power": 10,
                  "trophies": 543
                }
              }
            ]
          ]
        }
      },
      {
        "battleTime": "20240404T093249.000Z",
        "event": {
          "id": 15000702,
          "mode": "duoShowdown",
          "map": "Marksman's Paradise"
        },
        "battle": {
          "mode": "duoShowdown",
          "type": "ranked",
          "rank": 1,
          "trophyChange": 14,
          "teams": [
            [
              {
                "tag": "#YCQLVQV",
                "name": "Supersan_jlv",
                "brawler": {
                  "id": 16000064,
                  "name": "GRAY",
                  "power": 7,
                  "trophies": 40
                }
              },
              {
                "tag": "#80PQVU0G8",
                "name": "Brawl king",
                "brawler": {
                  "id": 16000068,
                  "name": "MAISIE",
                  "power": 7,
                  "trophies": 33
                }
              }
            ],
            [
              {
                "tag": "#P0V9RC88Q",
                "name": "Relax12",
                "brawler": {
                  "id": 16000072,
                  "name": "PEARL",
                  "power": 7,
                  "trophies": 40
                }
              },
              {
                "tag": "#PJJJ0CCQV",
                "name": "LA ENPANAITAA",
                "brawler": {
                  "id": 16000013,
                  "name": "POCO",
                  "power": 8,
                  "trophies": 32
                }
              }
            ],
            [
              {
                "tag": "#902UCVLCR",
                "name": "El bro 17",
                "brawler": {
                  "id": 16000057,
                  "name": "JANET",
                  "power": 7,
                  "trophies": 32
                }
              },
              {
                "tag": "#8R0GUQL8Q",
                "name": "qqqq",
                "brawler": {
                  "id": 16000008,
                  "name": "NITA",
                  "power": 8,
                  "trophies": 40
                }
              }
            ],
            [
              {
                "tag": "#282V8Y22",
                "name": "kayleigh",
                "brawler": {
                  "id": 16000010,
                  "name": "EL PRIMO",
                  "power": 7,
                  "trophies": 48
                }
              },
              {
                "tag": "#PYQQ0QL09",
                "name": "три икса",
                "brawler": {
                  "id": 16000060,
                  "name": "SAM",
                  "power": 8,
                  "trophies": 32
                }
              }
            ],
            [
              {
                "tag": "#J8L0YRQLC",
                "name": "baca",
                "brawler": {
                  "id": 16000034,
                  "name": "JACKY",
                  "power": 6,
                  "trophies": 32
                }
              },
              {
                "tag": "#LYRGP9Y0Q",
                "name": "3yejeyd82ishaks",
                "brawler": {
                  "id": 16000053,
                  "name": "LOLA",
                  "power": 6,
                  "trophies": 32
                }
              }
            ]
          ]
        }
      },
      {
        "battleTime": "20240404T093132.000Z",
        "event": {
          "id": 15000702,
          "mode": "duoShowdown",
          "map": "Marksman's Paradise"
        },
        "battle": {
          "mode": "duoShowdown",
          "type": "ranked",
          "rank": 1,
          "trophyChange": 14,
          "teams": [
            [
              {
                "tag": "#YCQLVQV",
                "name": "Supersan_jlv",
                "brawler": {
                  "id": 16000064,
                  "name": "GRAY",
                  "power": 7,
                  "trophies": 26
                }
              },
              {
                "tag": "#80PQVU0G8",
                "name": "Brawl king",
                "brawler": {
                  "id": 16000068,
                  "name": "MAISIE",
                  "power": 7,
                  "trophies": 21
                }
              }
            ],
            [
              {
                "tag": "#282LVCPVY",
                "name": "carcar",
                "brawler": {
                  "id": 16000018,
                  "name": "DARRYL",
                  "power": 6,
                  "trophies": 24
                }
              },
              {
                "tag": "#8VLJCYCJ9",
                "name": "felipe",
                "brawler": {
                  "id": 16000002,
                  "name": "BULL",
                  "power": 6,
                  "trophies": 32
                }
              }
            ],
            [
              {
                "tag": "#RC9CQCUC2",
                "name": "@gljump",
                "brawler": {
                  "id": 16000060,
                  "name": "SAM",
                  "power": 7,
                  "trophies": 32
                }
              },
              {
                "tag": "#JRUV0GPYV",
                "name": "dsc.gg/tsmod",
                "brawler": {
                  "id": 16000008,
                  "name": "NITA",
                  "power": 7,
                  "trophies": 24
                }
              }
            ],
            [
              {
                "tag": "#8LQLLVVR",
                "name": "thewolf",
                "brawler": {
                  "id": 16000003,
                  "name": "BROCK",
                  "power": 8,
                  "trophies": 32
                }
              },
              {
                "tag": "#Q8RP9GC2",
                "name": "Ralph 023",
                "brawler": {
                  "id": 16000072,
                  "name": "PEARL",
                  "power": 7,
                  "trophies": 16
                }
              }
            ],
            [
              {
                "tag": "#80YY02J09",
                "name": "Кирилл",
                "brawler": {
                  "id": 16000065,
                  "name": "MANDY",
                  "power": 8,
                  "trophies": 16
                }
              },
              {
                "tag": "#98VPLV0RV",
                "name": "velasquez",
                "brawler": {
                  "id": 16000027,
                  "name": "8-BIT",
                  "power": 6,
                  "trophies": 24
                }
              }
            ]
          ]
        }
      },
      {
        "battleTime": "20240404T092958.000Z",
        "event": {
          "id": 15000702,
          "mode": "duoShowdown",
          "map": "Marksman's Paradise"
        },
        "battle": {
          "mode": "duoShowdown",
          "type": "ranked",
          "rank": 1,
          "trophyChange": 14,
          "teams": [
            [
              {
                "tag": "#80PQVU0G8",
                "name": "Brawl king",
                "brawler": {
                  "id": 16000068,
                  "name": "MAISIE",
                  "power": 7,
                  "trophies": 10
                }
              },
              {
                "tag": "#YCQLVQV",
                "name": "Supersan_jlv",
                "brawler": {
                  "id": 16000064,
                  "name": "GRAY",
                  "power": 7,
                  "trophies": 12
                }
              }
            ],
            [
              {
                "tag": "#2QV8LUGQ0",
                "name": "кладовая бэктс",
                "brawler": {
                  "id": 16000008,
                  "name": "NITA",
                  "power": 7,
                  "trophies": 8
                }
              },
              {
                "tag": "#99YQ20P8",
                "name": "SKRRT",
                "brawler": {
                  "id": 16000018,
                  "name": "DARRYL",
                  "power": 6,
                  "trophies": 24
                }
              }
            ],
            [
              {
                "tag": "#292CLJV88",
                "name": "死亡巧克力",
                "brawler": {
                  "id": 16000021,
                  "name": "GENE",
                  "power": 6,
                  "trophies": 16
                }
              },
              {
                "tag": "#8RGGQPU08",
                "name": "Десислава",
                "brawler": {
                  "id": 16000000,
                  "name": "SHELLY",
                  "power": 8,
                  "trophies": 16
                }
              }
            ],
            [
              {
                "tag": "#LJCUUP08L",
                "name": "настя",
                "brawler": {
                  "id": 16000002,
                  "name": "BULL",
                  "power": 6,
                  "trophies": 24
                }
              },
              {
                "tag": "#2VQGCPP8L",
                "name": "RIFEL",
                "brawler": {
                  "id": 16000068,
                  "name": "MAISIE",
                  "power": 6,
                  "trophies": 24
                }
              }
            ],
            [
              {
                "tag": "#928UC0220",
                "name": "지은",
                "brawler": {
                  "id": 16000001,
                  "name": "COLT",
                  "power": 6,
                  "trophies": 8
                }
              },
              {
                "tag": "#8G8LL8Q2G",
                "name": "jojo",
                "brawler": {
                  "id": 16000004,
                  "name": "RICO",
                  "power": 6,
                  "trophies": 8
                }
              }
            ]
          ]
        }
      },
      {
        "battleTime": "20240404T092834.000Z",
        "event": {
          "id": 15000702,
          "mode": "duoShowdown",
          "map": "Marksman's Paradise"
        },
        "battle": {
          "mode": "duoShowdown",
          "type": "ranked",
          "rank": 2,
          "trophyChange": 12,
          "teams": [
            [
              {
                "tag": "#YLRR9GLL",
                "name": "крутышка",
                "brawler": {
                  "id": 16000027,
                  "name": "8-BIT",
                  "power": 8,
                  "trophies": 24
                }
              },
              {
                "tag": "#PGJ8Q288L",
                "name": "rise",
                "brawler": {
                  "id": 16000010,
                  "name": "EL PRIMO",
                  "power": 9,
                  "trophies": 24
                }
              }
            ],
            [
              {
                "tag": "#Y00J08LYP",
                "name": "эхххх",
                "brawler": {
                  "id": 16000079,
                  "name": "ANGELO",
                  "power": 9,
                  "trophies": 34
                }
              },
              {
                "tag": "#YCQLVQV",
                "name": "Supersan_jlv",
                "brawler": {
                  "id": 16000064,
                  "name": "GRAY",
                  "power": 7,
                  "trophies": 0
                }
              }
            ],
            [
              {
                "tag": "#LC0C9YV9U",
                "name": "вика",
                "brawler": {
                  "id": 16000052,
                  "name": "MEG",
                  "power": 8,
                  "trophies": 32
                }
              },
              {
                "tag": "#L2QGL9LUJ",
                "name": "bonzo",
                "brawler": {
                  "id": 16000007,
                  "name": "JESSIE",
                  "power": 9,
                  "trophies": 32
                }
              }
            ],
            [
              {
                "tag": "#C8C0LLRU",
                "name": "pro",
                "brawler": {
                  "id": 16000005,
                  "name": "SPIKE",
                  "power": 8,
                  "trophies": 32
                }
              },
              {
                "tag": "#Q998Y0QQP",
                "name": "бен",
                "brawler": {
                  "id": 16000000,
                  "name": "SHELLY",
                  "power": 8,
                  "trophies": 16
                }
              }
            ],
            [
              {
                "tag": "#Q0VJ822GL",
                "name": "⛩️Rzm64🥀",
                "brawler": {
                  "id": 16000022,
                  "name": "TICK",
                  "power": 7,
                  "trophies": 16
                }
              },
              {
                "tag": "#9JJ8C8890",
                "name": "Makamz",
                "brawler": {
                  "id": 16000076,
                  "name": "KIT",
                  "power": 9,
                  "trophies": 24
                }
              }
            ]
          ]
        }
      },
      {
        "battleTime": "20240404T092428.000Z",
        "event": {
          "id": 15000701,
          "mode": "soloShowdown",
          "map": "Marksman's Paradise"
        },
        "battle": {
          "mode": "soloShowdown",
          "type": "ranked",
          "rank": 4,
          "trophyChange": 10,
          "players": [
            {
              "tag": "#9JQ0GRVLR",
              "name": "[BAN]Ski$ller",
              "brawler": {
                "id": 16000076,
                "name": "KIT",
                "power": 11,
                "trophies": 425
              }
            },
            {
              "tag": "#GQJYJVJ29",
              "name": "Bergan54",
              "brawler": {
                "id": 16000012,
                "name": "CROW",
                "power": 11,
                "trophies": 409
              }
            },
            {
              "tag": "#2LC0VGQL9",
              "name": "IMPE R. 199",
              "brawler": {
                "id": 16000053,
                "name": "LOLA",
                "power": 8,
                "trophies": 394
              }
            },
            {
              "tag": "#YCQLVQV",
              "name": "Supersan_jlv",
              "brawler": {
                "id": 16000079,
                "name": "ANGELO",
                "power": 7,
                "trophies": 421
              }
            },
            {
              "tag": "#U2VPC8UV",
              "name": "Arazhul HD",
              "brawler": {
                "id": 16000039,
                "name": "COLETTE",
                "power": 11,
                "trophies": 401
              }
            },
            {
              "tag": "#YJ0QGRV0G",
              "name": "Eitan",
              "brawler": {
                "id": 16000040,
                "name": "AMBER",
                "power": 7,
                "trophies": 402
              }
            },
            {
              "tag": "#89L9GUYR8",
              "name": "silinio",
              "brawler": {
                "id": 16000079,
                "name": "ANGELO",
                "power": 8,
                "trophies": 394
              }
            },
            {
              "tag": "#L2LL0QL8U",
              "name": "as",
              "brawler": {
                "id": 16000067,
                "name": "WILLOW",
                "power": 9,
                "trophies": 408
              }
            },
            {
              "tag": "#8VUYCV092",
              "name": "тапок",
              "brawler": {
                "id": 16000065,
                "name": "MANDY",
                "power": 9,
                "trophies": 436
              }
            },
            {
              "tag": "#QPPGVP2JL",
              "name": "def",
              "brawler": {
                "id": 16000064,
                "name": "GRAY",
                "power": 10,
                "trophies": 382
              }
            }
          ]
        }
      },
      {
        "battleTime": "20240404T092245.000Z",
        "event": {
          "id": 15000701,
          "mode": "soloShowdown",
          "map": "Marksman's Paradise"
        },
        "battle": {
          "mode": "soloShowdown",
          "type": "ranked",
          "rank": 2,
          "trophyChange": 12,
          "players": [
            {
              "tag": "#9Y8JGJ0JR",
              "name": "кαяιмιησッ",
              "brawler": {
                "id": 16000068,
                "name": "MAISIE",
                "power": 8,
                "trophies": 376
              }
            },
            {
              "tag": "#YCQLVQV",
              "name": "Supersan_jlv",
              "brawler": {
                "id": 16000079,
                "name": "ANGELO",
                "power": 7,
                "trophies": 409
              }
            },
            {
              "tag": "#PY0RUUQL",
              "name": "Nicki Minaj",
              "brawler": {
                "id": 16000074,
                "name": "CHARLIE",
                "power": 11,
                "trophies": 399
              }
            },
            {
              "tag": "#28GP0R8RQ",
              "name": "Michnik",
              "brawler": {
                "id": 16000064,
                "name": "GRAY",
                "power": 7,
                "trophies": 369
              }
            },
            {
              "tag": "#800RQR900",
              "name": "FL4XIN09",
              "brawler": {
                "id": 16000076,
                "name": "KIT",
                "power": 9,
                "trophies": 362
              }
            },
            {
              "tag": "#PG0LRVPL",
              "name": "roli11ss",
              "brawler": {
                "id": 16000054,
                "name": "FANG",
                "power": 10,
                "trophies": 398
              }
            },
            {
              "tag": "#9VYQCJ0L8",
              "name": "GX_RAYAN_IL_PRO",
              "brawler": {
                "id": 16000050,
                "name": "GRIFF",
                "power": 7,
                "trophies": 404
              }
            },
            {
              "tag": "#YV92Q220L",
              "name": "ral.123",
              "brawler": {
                "id": 16000001,
                "name": "COLT",
                "power": 8,
                "trophies": 420
              }
            },
            {
              "tag": "#PQU0JRVGG",
              "name": "MrBrandys",
              "brawler": {
                "id": 16000074,
                "name": "CHARLIE",
                "power": 7,
                "trophies": 413
              }
            },
            {
              "tag": "#22PJ2P9RG",
              "name": "mitica beach",
              "brawler": {
                "id": 16000039,
                "name": "COLETTE",
                "power": 10,
                "trophies": 415
              }
            }
          ]
        }
      },
      {
        "battleTime": "20240404T091956.000Z",
        "event": {
          "id": 15000701,
          "mode": "soloShowdown",
          "map": "Marksman's Paradise"
        },
        "battle": {
          "mode": "soloShowdown",
          "type": "ranked",
          "rank": 1,
          "trophyChange": 13,
          "players": [
            {
              "tag": "#YCQLVQV",
              "name": "Supersan_jlv",
              "brawler": {
                "id": 16000079,
                "name": "ANGELO",
                "power": 7,
                "trophies": 396
              }
            },
            {
              "tag": "#92PJQ9P99",
              "name": "flufy_24",
              "brawler": {
                "id": 16000075,
                "name": "MICO",
                "power": 8,
                "trophies": 399
              }
            },
            {
              "tag": "#9UUGUVLLP",
              "name": "Бодя",
              "brawler": {
                "id": 16000065,
                "name": "MANDY",
                "power": 8,
                "trophies": 404
              }
            },
            {
              "tag": "#8G80Y0U2G",
              "name": "MessiSwift",
              "brawler": {
                "id": 16000023,
                "name": "LEON",
                "power": 9,
                "trophies": 385
              }
            },
            {
              "tag": "#LGJVJULYC",
              "name": "Lukas",
              "brawler": {
                "id": 16000028,
                "name": "SANDY",
                "power": 7,
                "trophies": 364
              }
            },
            {
              "tag": "#QCCUG9V",
              "name": "XiC",
              "brawler": {
                "id": 16000053,
                "name": "LOLA",
                "power": 7,
                "trophies": 408
              }
            },
            {
              "tag": "#8JJ9PGCR2",
              "name": "ЧИТЕР777",
              "brawler": {
                "id": 16000068,
                "name": "MAISIE",
                "power": 11,
                "trophies": 405
              }
            },
            {
              "tag": "#8C88GQQG8",
              "name": "simanon",
              "brawler": {
                "id": 16000070,
                "name": "CORDELIUS",
                "power": 9,
                "trophies": 400
              }
            },
            {
              "tag": "#8990C2Q0L",
              "name": "Pakalus",
              "brawler": {
                "id": 16000072,
                "name": "PEARL",
                "power": 9,
                "trophies": 392
              }
            },
            {
              "tag": "#PY999LGJG",
              "name": "Lukas",
              "brawler": {
                "id": 16000044,
                "name": "RUFFS",
                "power": 7,
                "trophies": 384
              }
            }
          ]
        }
      },
      {
        "battleTime": "20240404T091812.000Z",
        "event": {
          "id": 15000701,
          "mode": "soloShowdown",
          "map": "Marksman's Paradise"
        },
        "battle": {
          "mode": "soloShowdown",
          "type": "ranked",
          "rank": 5,
          "trophyChange": 2,
          "players": [
            {
              "tag": "#QC2CJY9Q",
              "name": "SaucisseThaï",
              "brawler": {
                "id": 16000054,
                "name": "FANG",
                "power": 9,
                "trophies": 379
              }
            },
            {
              "tag": "#QLYY8JV89",
              "name": "🦥丨Slothy丨🌸",
              "brawler": {
                "id": 16000023,
                "name": "LEON",
                "power": 7,
                "trophies": 374
              }
            },
            {
              "tag": "#922QQRPP0",
              "name": "FCA",
              "brawler": {
                "id": 16000053,
                "name": "LOLA",
                "power": 7,
                "trophies": 375
              }
            },
            {
              "tag": "#8VUVRP9Q8",
              "name": "MAKI",
              "brawler": {
                "id": 16000064,
                "name": "GRAY",
                "power": 8,
                "trophies": 385
              }
            },
            {
              "tag": "#YCQLVQV",
              "name": "Supersan_jlv",
              "brawler": {
                "id": 16000079,
                "name": "ANGELO",
                "power": 7,
                "trophies": 394
              }
            },
            {
              "tag": "#2VVL0LQLR",
              "name": "Lenart Bayern",
              "brawler": {
                "id": 16000065,
                "name": "MANDY",
                "power": 9,
                "trophies": 391
              }
            },
            {
              "tag": "#2CUJ2RRLJ",
              "name": "krosur",
              "brawler": {
                "id": 16000074,
                "name": "CHARLIE",
                "power": 8,
                "trophies": 377
              }
            },
            {
              "tag": "#C8LQ02U",
              "name": "Javierichi",
              "brawler": {
                "id": 16000066,
                "name": "R-T",
                "power": 8,
                "trophies": 360
              }
            },
            {
              "tag": "#8VUC2LRC9",
              "name": "FaZe_tomTC7",
              "brawler": {
                "id": 16000032,
                "name": "MAX",
                "power": 8,
                "trophies": 392
              }
            },
            {
              "tag": "#8V0P2U2CY",
              "name": "₣ⱤɆĐĐɎ",
              "brawler": {
                "id": 16000064,
                "name": "GRAY",
                "power": 9,
                "trophies": 397
              }
            }
          ]
        }
      },
      {
        "battleTime": "20240404T091527.000Z",
        "event": {
          "id": 15000701,
          "mode": "soloShowdown",
          "map": "Marksman's Paradise"
        },
        "battle": {
          "mode": "soloShowdown",
          "type": "ranked",
          "rank": 1,
          "trophyChange": 12,
          "players": [
            {
              "tag": "#YCQLVQV",
              "name": "Supersan_jlv",
              "brawler": {
                "id": 16000079,
                "name": "ANGELO",
                "power": 7,
                "trophies": 382
              }
            },
            {
              "tag": "#2UJUUGQ99",
              "name": "Brawler",
              "brawler": {
                "id": 16000040,
                "name": "AMBER",
                "power": 9,
                "trophies": 402
              }
            },
            {
              "tag": "#C0UGVG8L",
              "name": "jeast",
              "brawler": {
                "id": 16000023,
                "name": "LEON",
                "power": 9,
                "trophies": 400
              }
            },
            {
              "tag": "#L9P82U02P",
              "name": "Master LOL",
              "brawler": {
                "id": 16000074,
                "name": "CHARLIE",
                "power": 9,
                "trophies": 343
              }
            },
            {
              "tag": "#PG80VY088",
              "name": "Bot 4",
              "brawler": {
                "id": 16000064,
                "name": "GRAY",
                "power": 8,
                "trophies": 385
              }
            },
            {
              "tag": "#98PLRUGG9",
              "name": "Ice_",
              "brawler": {
                "id": 16000050,
                "name": "GRIFF",
                "power": 8,
                "trophies": 403
              }
            },
            {
              "tag": "#2C9R8CLPV",
              "name": "Skrillex",
              "brawler": {
                "id": 16000039,
                "name": "COLETTE",
                "power": 6,
                "trophies": 389
              }
            },
            {
              "tag": "#20CPP9RGP",
              "name": "ⁱᵃᵐ|𝘼ᴻⲍο𝗱𒆜",
              "brawler": {
                "id": 16000063,
                "name": "CHESTER",
                "power": 9,
                "trophies": 392
              }
            },
            {
              "tag": "#99G0CVC28",
              "name": "Rg.777",
              "brawler": {
                "id": 16000076,
                "name": "KIT",
                "power": 7,
                "trophies": 405
              }
            },
            {
              "tag": "#YUGQ29L2U",
              "name": "E🖤CRACKY🖤",
              "brawler": {
                "id": 16000064,
                "name": "GRAY",
                "power": 8,
                "trophies": 372
              }
            }
          ]
        }
      },
      {
        "battleTime": "20240404T091255.000Z",
        "event": {
          "id": 15000701,
          "mode": "soloShowdown",
          "map": "Marksman's Paradise"
        },
        "battle": {
          "mode": "soloShowdown",
          "type": "ranked",
          "rank": 1,
          "trophyChange": 11,
          "players": [
            {
              "tag": "#YCQLVQV",
              "name": "Supersan_jlv",
              "brawler": {
                "id": 16000079,
                "name": "ANGELO",
                "power": 7,
                "trophies": 371
              }
            },
            {
              "tag": "#QPQCRU0GU",
              "name": "pro özgür",
              "brawler": {
                "id": 16000012,
                "name": "CROW",
                "power": 10,
                "trophies": 410
              }
            },
            {
              "tag": "#2QY0YVQY8",
              "name": "Ваня про",
              "brawler": {
                "id": 16000072,
                "name": "PEARL",
                "power": 7,
                "trophies": 376
              }
            },
            {
              "tag": "#8JCLR02UU",
              "name": "Jarco_",
              "brawler": {
                "id": 16000042,
                "name": "BYRON",
                "power": 6,
                "trophies": 385
              }
            },
            {
              "tag": "#L00GRYY2V",
              "name": "ADprogamer233",
              "brawler": {
                "id": 16000021,
                "name": "GENE",
                "power": 9,
                "trophies": 390
              }
            },
            {
              "tag": "#8VR8RGYQ0",
              "name": "[TOP] Kretoxx❤",
              "brawler": {
                "id": 16000076,
                "name": "KIT",
                "power": 9,
                "trophies": 382
              }
            },
            {
              "tag": "#QUL82URY9",
              "name": "KİNG4770",
              "brawler": {
                "id": 16000046,
                "name": "BELLE",
                "power": 7,
                "trophies": 409
              }
            },
            {
              "tag": "#8QYLJCC89",
              "name": "NoLiferCz",
              "brawler": {
                "id": 16000017,
                "name": "TARA",
                "power": 7,
                "trophies": 409
              }
            },
            {
              "tag": "#LGGCVVYGP",
              "name": "АliceWonder",
              "brawler": {
                "id": 16000077,
                "name": "LARRY & LAWRIE",
                "power": 9,
                "trophies": 410
              }
            },
            {
              "tag": "#2Y09VCRLY",
              "name": "ʟᴏʟʟᴏシ︎ᵏⁱˡˡyou",
              "brawler": {
                "id": 16000047,
                "name": "SQUEAK",
                "power": 7,
                "trophies": 402
              }
            }
          ]
        }
      },
      {
        "battleTime": "20240404T091109.000Z",
        "event": {
          "id": 15000701,
          "mode": "soloShowdown",
          "map": "Marksman's Paradise"
        },
        "battle": {
          "mode": "soloShowdown",
          "type": "ranked",
          "rank": 4,
          "trophyChange": 5,
          "players": [
            {
              "tag": "#8JUQC92LG",
              "name": "𝕭𝖆ͥ𝖈𝖔ͣ𝖓ͫ🇭",
              "brawler": {
                "id": 16000043,
                "name": "EDGAR",
                "power": 11,
                "trophies": 395
              }
            },
            {
              "tag": "#L0V8Y29UP",
              "name": "lord",
              "brawler": {
                "id": 16000012,
                "name": "CROW",
                "power": 10,
                "trophies": 372
              }
            },
            {
              "tag": "#9Y298J2JC",
              "name": "💫Tl|⚡️Geø",
              "brawler": {
                "id": 16000072,
                "name": "PEARL",
                "power": 8,
                "trophies": 369
              }
            },
            {
              "tag": "#YCQLVQV",
              "name": "Supersan_jlv",
              "brawler": {
                "id": 16000079,
                "name": "ANGELO",
                "power": 7,
                "trophies": 366
              }
            },
            {
              "tag": "#92QGU80JP",
              "name": "g҉o҉d҉h҉y҉r҉a҉",
              "brawler": {
                "id": 16000031,
                "name": "MR. P",
                "power": 8,
                "trophies": 373
              }
            },
            {
              "tag": "#J8YY209J",
              "name": "DERODA[W]🔥",
              "brawler": {
                "id": 16000068,
                "name": "MAISIE",
                "power": 7,
                "trophies": 385
              }
            },
            {
              "tag": "#YU8CVGCL",
              "name": "sasuke™",
              "brawler": {
                "id": 16000054,
                "name": "FANG",
                "power": 10,
                "trophies": 367
              }
            },
            {
              "tag": "#2VP0GC8C8",
              "name": "AZE(SIRIN)",
              "brawler": {
                "id": 16000079,
                "name": "ANGELO",
                "power": 8,
                "trophies": 384
              }
            },
            {
              "tag": "#PLGLCGRQC",
              "name": "Kostya",
              "brawler": {
                "id": 16000077,
                "name": "LARRY & LAWRIE",
                "power": 8,
                "trophies": 363
              }
            },
            {
              "tag": "#9UYLVUJQV",
              "name": "exxxile",
              "brawler": {
                "id": 16000070,
                "name": "CORDELIUS",
                "power": 9,
                "trophies": 367
              }
            }
          ]
        }
      },
      {
        "battleTime": "20240404T090925.000Z",
        "event": {
          "id": 15000701,
          "mode": "soloShowdown",
          "map": "Marksman's Paradise"
        },
        "battle": {
          "mode": "soloShowdown",
          "type": "ranked",
          "rank": 7,
          "players": [
            {
              "tag": "#8CQQY0GPJ",
              "name": "Shadow Ninja",
              "brawler": {
                "id": 16000078,
                "name": "MELODIE",
                "power": 11,
                "trophies": 369
              }
            },
            {
              "tag": "#8PJ90UJCL",
              "name": "RealAdil",
              "brawler": {
                "id": 16000053,
                "name": "LOLA",
                "power": 7,
                "trophies": 348
              }
            },
            {
              "tag": "#90PQ2LVJP",
              "name": "Paul",
              "brawler": {
                "id": 16000023,
                "name": "LEON",
                "power": 9,
                "trophies": 356
              }
            },
            {
              "tag": "#2VRVRJ2QP",
              "name": "Alex futbito",
              "brawler": {
                "id": 16000075,
                "name": "MICO",
                "power": 9,
                "trophies": 365
              }
            },
            {
              "tag": "#2L089Q8J8",
              "name": "K4rb0si1k",
              "brawler": {
                "id": 16000064,
                "name": "GRAY",
                "power": 8,
                "trophies": 357
              }
            },
            {
              "tag": "#202RYY02P",
              "name": "Ernest",
              "brawler": {
                "id": 16000061,
                "name": "GUS",
                "power": 6,
                "trophies": 354
              }
            },
            {
              "tag": "#YCQLVQV",
              "name": "Supersan_jlv",
              "brawler": {
                "id": 16000079,
                "name": "ANGELO",
                "power": 7,
                "trophies": 366
              }
            },
            {
              "tag": "#P2Y0LCR2L",
              "name": "Baby bro",
              "brawler": {
                "id": 16000040,
                "name": "AMBER",
                "power": 11,
                "trophies": 376
              }
            },
            {
              "tag": "#8JY2QJLUJ",
              "name": "frank",
              "brawler": {
                "id": 16000050,
                "name": "GRIFF",
                "power": 8,
                "trophies": 364
              }
            },
            {
              "tag": "#PGUU9UL90",
              "name": "14xj@m¡e",
              "brawler": {
                "id": 16000006,
                "name": "BARLEY",
                "power": 9,
                "trophies": 358
              }
            }
          ]
        }
      },
      {
        "battleTime": "20240403T111336.000Z",
        "event": {
          "id": 15000440,
          "mode": "knockout",
          "map": "Flaring Phoenix"
        },
        "battle": {
          "mode": "knockout",
          "type": "ranked",
          "result": "victory",
          "duration": 102,
          "trophyChange": 10,
          "starPlayer": {
            "tag": "#2LPG8PJ2",
            "name": "арсеник",
            "brawler": {
              "id": 16000054,
              "name": "FANG",
              "power": 9,
              "trophies": 398
            }
          },
          "teams": [
            [
              {
                "tag": "#L9U29G0VQ",
                "name": "baobab🌳",
                "brawler": {
                  "id": 16000021,
                  "name": "GENE",
                  "power": 7,
                  "trophies": 370
                }
              },
              {
                "tag": "#Q2UG028YP",
                "name": "😆😆😆😆😆😆😆",
                "brawler": {
                  "id": 16000005,
                  "name": "SPIKE",
                  "power": 9,
                  "trophies": 376
                }
              },
              {
                "tag": "#PVVV9QJ0P",
                "name": "КОПЛЮ СУНДУКИ",
                "brawler": {
                  "id": 16000075,
                  "name": "MICO",
                  "power": 9,
                  "trophies": 381
                }
              }
            ],
            [
              {
                "tag": "#2LPG8PJ2",
                "name": "арсеник",
                "brawler": {
                  "id": 16000054,
                  "name": "FANG",
                  "power": 9,
                  "trophies": 398
                }
              },
              {
                "tag": "#YCQLVQV",
                "name": "Supersan_jlv",
                "brawler": {
                  "id": 16000065,
                  "name": "MANDY",
                  "power": 7,
                  "trophies": 395
                }
              },
              {
                "tag": "#8UQ0V0GLV",
                "name": "YT|balu",
                "brawler": {
                  "id": 16000048,
                  "name": "GROM",
                  "power": 8,
                  "trophies": 356
                }
              }
            ]
          ]
        }
      },
      {
        "battleTime": "20240403T111131.000Z",
        "event": {
          "id": 15000440,
          "mode": "knockout",
          "map": "Flaring Phoenix"
        },
        "battle": {
          "mode": "knockout",
          "type": "ranked",
          "result": "victory",
          "duration": 195,
          "trophyChange": 9,
          "starPlayer": {
            "tag": "#2LPG8PJ2",
            "name": "арсеник",
            "brawler": {
              "id": 16000054,
              "name": "FANG",
              "power": 9,
              "trophies": 390
            }
          },
          "teams": [
            [
              {
                "tag": "#YCQLVQV",
                "name": "Supersan_jlv",
                "brawler": {
                  "id": 16000065,
                  "name": "MANDY",
                  "power": 7,
                  "trophies": 386
                }
              },
              {
                "tag": "#2LPG8PJ2",
                "name": "арсеник",
                "brawler": {
                  "id": 16000054,
                  "name": "FANG",
                  "power": 9,
                  "trophies": 390
                }
              },
              {
                "tag": "#G292G0L2",
                "name": "מלך",
                "brawler": {
                  "id": 16000048,
                  "name": "GROM",
                  "power": 9,
                  "trophies": 383
                }
              }
            ],
            [
              {
                "tag": "#22P9UC0PL",
                "name": "boxter",
                "brawler": {
                  "id": 16000072,
                  "name": "PEARL",
                  "power": 10,
                  "trophies": 312
                }
              },
              {
                "tag": "#80PGL92V8",
                "name": "Brawler",
                "brawler": {
                  "id": 16000009,
                  "name": "DYNAMIKE",
                  "power": 9,
                  "trophies": 417
                }
              },
              {
                "tag": "#9QV9QLCGC",
                "name": "sleepy😪",
                "brawler": {
                  "id": 16000040,
                  "name": "AMBER",
                  "power": 9,
                  "trophies": 393
                }
              }
            ]
          ]
        }
      }
    ],
    "paging": {
      "cursors": {}
    }
  }
  
console.log(await brawlRecentBattle(playerTagEX));
//console.log(await brawlInfo(playerTagEX));
