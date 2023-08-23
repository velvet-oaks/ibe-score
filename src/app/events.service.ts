import { Injectable } from '@angular/core';

import * as currentEventDummy from './data/currentEvent.json'

import * as eventDummy from './data/events_new.json';
import * as playerDummy from './data/users.json';
import * as eventTypesDummy from './data/tableTypes.json';
import * as historicGamesDummy from './data/historic.json'

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor() { }

  getCurrentEvent() {

    //Import Relevanent Files into var
    let currentEventRaw = eventDummy;
    let currentEvent = currentEventRaw[0]
    let players = playerDummy;

    if (currentEvent.date_ended != "current") {
      return { exists: false, data: {} };
    };
    let tableTypes: object = eventTypesDummy
    let tableType: string = currentEvent.playerConfig.type
    let tableTypeData: any = (tableTypes as any)[tableType]
    let playerTables = new Array();
    let chunk_size: any;
    if (tableTypeData.per_side == "variable") {
      chunk_size = currentEvent.playerConfig.team_size;
    } else {
      chunk_size = tableTypeData.per_side;
    }
    // TODO: Readinto how Swiss Pairs/ Teams work
    // Placeholder IF STATMENT

    if (1 == 1) {
      const result = currentEvent.playerConfig.players.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / chunk_size)
        if (!resultArray[chunkIndex]) {
          (resultArray as any)[chunkIndex] = [] // start a new chunk
        }

        (resultArray as any)[chunkIndex].push(item)
        return resultArray
      }, [])

    //  console.log(result);
      let finalPlayerTable = new Array();
      let b = 0
      for (let i = 0; i < result.length / 2; i++){

        if (b != 0){

          b = b + 1
        }

        let newObj = {
          ns:result[b],
          ew:result[b + 1]
        };
        b++;
        finalPlayerTable.push(newObj)
      };
      (currentEvent.playerConfig as any)['sorted_players'] = finalPlayerTable;
    //  console.log(currentEvent)
      return currentEvent;
    } else {
      return currentEvent
    }

  }

  getHistoricEvents(){
    let histArray = [];
    let histSource = historicGamesDummy;
    let histSourceArray = histSource.hist.histitem;
    for (let histIdx in histSourceArray){
      (histSourceArray as any)[histIdx]["item"] = Number(histIdx) + 1;
      histArray.push(histSourceArray[histIdx]);
    };
    return histArray;
  }
  getPlayers(){
    let playerArray = new Array();
    let plSrc = playerDummy;
    let last_play = "lastplay"
    for (let plIdx = 0; plIdx < plSrc.length; plIdx++){
     // console.log(plSrc.length)
      if (!plSrc[plIdx].userData.lastPlay){

        (plSrc as any)[plIdx][last_play] = {"_date":""};
      }
      //(plSrc as any)[plIdx]["test"] = Number(plIdx) + 1;
      playerArray.push(plSrc[plIdx])
    }
    return playerArray;
  }
}
