<template>
    <div class="main-wrapper">
        <div class="header">
            <div class="main-title big">맛</div>
            <div class="main-title small">따라</div>
            <div style="width: 24px;"></div>
            <div class="main-title big">길</div>
            <div class="main-title small">따라</div>
        </div>
        <div class="content-zone">
            <a-tabs v-model="tabs">
                <a-tab-pane key="list">
                    <span slot="tab">
                        <a-icon type="apple" />
                        노션별 휴게소 정보
                    </span>
                    <div v-if="selectedHighway === ''">
                        선택된 고속도로 없음
                    </div>
                    <div v-else class="content-table-zone">
                        <div class="content-table-title">
                            {{ selectedHighway }}
                        </div>
                        <div class="content-table">
                            <div class="attribute-zone">
                                <div class="attribute flex-2">휴게소 이름</div>
                                <div class="attribute flex-4">주소</div>
                                <div class="attribute flex-2">전화번호</div>
                                <div class="attribute flex-5">대표 음식</div>
                                <!-- <div class="attribute flex-1">대형차</div>
                                <div class="attribute flex-1">중형차</div>
                                <div class="attribute flex-1">소형차</div> -->
                            </div>
                            <div class="tuple-zone">
                                <div
                                    v-for="(r, i) in restAreas"
                                    :key="'tuple' + i"
                                    class="tuple"
                                >
                                    <div class="item flex-2">{{ r.rname }}</div>
                                    <div class="item flex-4">
                                        {{ r.address }}
                                    </div>
                                    <div class="item flex-2">
                                        {{ getTelFormat(r.telephone) }}
                                    </div>
                                    <div class="item flex-5">
                                        {{ r.fname.join(', ') }}
                                    </div>
                                    <!-- <div class="item flex-1">{{  }}</div>
                                    <div class="item flex-1">11</div>
                                    <div class="item flex-1">11</div> -->
                                </div>
                            </div>
                        </div>
                    </div>
                </a-tab-pane>
                <a-tab-pane key="info" tab="휴게소 정보" force-render>
                    <div v-if="selectedRestArea === ''">
                        선택된 휴게소 없음
                    </div>
                    <div v-else>{{ selectedRestArea }}</div>
                </a-tab-pane>
            </a-tabs>
            <div class="select-zone">
                <a-select
                    default-value="고속도로 선택"
                    style="width: 200px"
                    @change="highwayChange"
                    v-if="highways.length !== 0"
                >
                    <a-select-option
                        v-for="h in highways"
                        :key="h.routeCd"
                        :value="h.hname + '(' + h.gudclssnm + ')'"
                        @click="clickHighway(h)"
                    >
                        {{ h.hname + '(' + h.gudclssnm + ')' }}
                    </a-select-option>
                </a-select>
                <div style="width: 20px"></div>
                <a-select
                    default-value="휴게소 선택"
                    style="width: 200px"
                    @change="restAreaChange"
                    v-if="restAreas.length !== 0"
                >
                    <a-select-option
                        v-for="r in restAreas"
                        :key="r.rid"
                        :value="r.rname"
                    >
                        {{ r.rname }}
                    </a-select-option>
                </a-select>
            </div>
        </div>
    </div>
</template>

<script src="./main.ts" />

<style lang="scss" scoped>
@import './main.scss';
</style>
