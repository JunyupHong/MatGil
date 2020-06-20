import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import axios from 'axios';
// const url = 'http://172.30.1.57:3000';
const url = 'http://127.0.0.1:3000';

@Component({})
export default class Main extends Vue {
    private tabs: 'list' | 'info' = 'list';
    private selectedHighway = '';
    private selectedRestArea = '';
    private highways = [];
    private restAreas = [];
    private restAreaInfo: any = {};
    private showDialog = false;
    private selectedFood: any = undefined;

    private getTelFormat(tel: string) {
        const telFormat = [...tel.split('')];
        telFormat.reverse().splice(4, 0, '-');
        telFormat.splice(8, 0, '-');
        telFormat.reverse();
        return telFormat.join('');
    }
    private async highwayChange(value: string) {
        console.log('고속도로 변경', value);
        this.selectedHighway = value;
        this.tabs = 'list';
    }
    private restAreaChange(value: string) {
        console.log('휴게소 변경', value);
        this.selectedRestArea = value;
        this.tabs = 'info';
    }

    private async clickHighway(highway: any) {
        console.log(highway);
        this.restAreas = (
            await axios(`${url}/db/restarea/${highway.hid}`)
        ).data;
        console.log(this.restAreas);
    }
    private async clickRestArea(restArea: any) {
        console.log(restArea);
        this.restAreaInfo = (
            await axios(`${url}/db/restarea/info/${restArea.rid}`)
        ).data;
        console.log(this.restAreaInfo);
    }

    private async clickFood(food: any) {
        const result = (
            await axios(`${url}/db/food/${food.fid}`)
        ).data;
        console.log(result);
        this.selectedFood = result;
        this.showDialog = true;
    }

    private async mounted() {
        this.highways = (
            await axios.get(`${url}/db/highway`)
        ).data;
    }
}
