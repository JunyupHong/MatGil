import Vue from 'vue';
import {Component} from 'vue-property-decorator';

@Component({})
export default class Main extends Vue {
    private selectedHighway = '';
    private selectedRestArea = '';

    private highwayChange(value: string) {
        console.log('고속도로 변경', value);
        this.selectedHighway = value;
    }
    private restAreaChange(value: string) {
        console.log('휴게소 변경', value);
        this.selectedRestArea = value;
    }
}
