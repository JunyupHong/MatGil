<template>
    <div>
        <div
            v-if="showDialog"
            class="dialog-wrapper"
            @click.self="showDialog = false"
        >
            <div class="dialog">
                <div class="dialog-title">{{ selectedFood.fname }}</div>
                <div
                    style="width: 100%;
                    margin: 12px 0; border-bottom: solid 2px #ccc;"
                ></div>
                <div class="dialog-content-area">
                    <div class="dialog-content">
                        <div class="dialog-content-title">음식 가격</div>
                        <div class="dialog-content-desc">
                            {{ selectedFood.fcost }}
                        </div>
                    </div>
                    <div class="dialog-content">
                        <div class="dialog-content-title">음식 재료</div>
                        <div class="dialog-content-desc">
                            {{ selectedFood.foodmaterial }}
                        </div>
                    </div>
                    <div class="dialog-content">
                        <div class="dialog-content-title">음식 설명</div>
                        <div class="dialog-content-desc">
                            {{ selectedFood.fdesc }}
                        </div>
                    </div>
                    <div v-if="selectedFood.bestmenu === 'Y'" class="dialog-content">
                        <div class="etc">휴게소의 대표메뉴 입니다.</div>
                    </div>
                    <div v-if="selectedFood.recommendmenu === 'Y'" class="dialog-content">
                        <div class="etc">휴게소의 추천메뉴 입니다.</div>
                    </div>
                    <div v-if="selectedFood.premiunMenu === 'Y'" class="dialog-content">
                        <div class="etc">휴게소의 프리미엄 메뉴 입니다.</div>
                    </div>
                </div>
            </div>
        </div>
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
                            <!-- <a-icon type="apple" /> -->
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
                        <div v-else class="content-table-zone">
                            <div class="content-table-title">
                                {{ selectedRestArea }}
                            </div>
                            <div class="content-table-row">
                                <div class="attribute-zone">
                                    <div class="attribute">음식</div>
                                </div>
                                <div class="tuple-zone">
                                    <div
                                        v-for="(f, i) in restAreaInfo.food"
                                        :key="'restAreaInfo-food-tuple' + i"
                                        class="tuple food"
                                        @click="clickFood(f)"
                                    >
                                        <div class="item flex-1">
                                            {{ f.fname }}
                                        </div>
                                        <div class="item flex-4">
                                            {{ f.fcost }} 원
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style="height: 28px;"></div>
                            <div class="content-table-row">
                                <div class="attribute-zone">
                                    <div class="attribute">브랜드</div>
                                </div>
                                <div class="tuple-zone">
                                    <div
                                        v-for="(b, i) in restAreaInfo.brand"
                                        :key="'restAreaInfo-brand-tuple' + i"
                                        class="tuple"
                                    >
                                        <div class="item flex-1">
                                            {{ b.bname }}
                                        </div>
                                        <div class="item flex-4">
                                            {{ b.bdesc }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style="height: 28px;"></div>
                            <div class="content-table-row">
                                <div class="attribute-zone">
                                    <div class="attribute">편의시설</div>
                                </div>
                                <div class="tuple-zone">
                                    <div
                                        v-for="(c, i) in restAreaInfo.convenience"
                                        :key="'restAreaInfo-convenience-tuple' + i"
                                        class="tuple"
                                    >
                                        <div class="item flex-1">
                                            {{ c.cname }}
                                        </div>
                                        <div class="item flex-4">
                                            {{ c.cdesc }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                            @click="clickRestArea(r)"
                        >
                            {{ r.rname }}
                        </a-select-option>
                    </a-select>
                </div>
            </div>
        </div>
    </div>
</template>

<script src="./main.ts" />

<style lang="scss" scoped>
@import './main.scss';
</style>
