import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import axios from 'axios';
import _ from 'lodash';

@Component({})
export default class Main extends Vue {
    private tabs: 'list' | 'info' = 'list';
    private selectedHighway = '';
    private selectedRestArea = '';
    private highways = [];
    private restAreas = [];

    private getTelFormat(tel: string) {
        const telFormat = [...tel.split('')];
        telFormat.reverse().splice(4, 0, '-');
        telFormat.splice(8, 0, '-')
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

    private async clickHighway(value: any) {
        console.log(value);
        this.restAreas = (await axios(`http://127.0.0.1:3000/db/restarea/${value.hid}`)).data;
        console.log(this.restAreas);
    }
    private async mounted() {
        this.highways = (await axios.get('http://127.0.0.1:3000/db/highway')).data;
    }
}
