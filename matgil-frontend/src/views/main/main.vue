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
            <a-tabs default-active-key="list">
                <a-tab-pane key="list">
                    <span slot="tab">
                        <a-icon type="apple" />
                        노션별 휴게소 정보
                    </span>
                    <div v-if="selectedHighway === ''">
                        선택된 고속도로 없음
                    </div>
                    <div v-else>{{ selectedHighway }}</div>
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
                    style="width: 120px"
                    @change="highwayChange"
                >
                    <a-select-option value="Jack">
                        Jack
                    </a-select-option>
                    <a-select-option value="lucy">
                        Lucy
                    </a-select-option>
                    <a-select-option value="Yiminghe">
                        yiminghe
                    </a-select-option>
                </a-select>
                <div style="width: 20px"></div>
                <a-select
                    default-value="휴게소 선택"
                    style="width: 120px"
                    @change="restAreaChange"
                >
                    <a-select-option value="Jack">
                        Jack
                    </a-select-option>
                    <a-select-option value="lucy">
                        Lucy
                    </a-select-option>
                    <a-select-option value="Yiminghe">
                        yiminghe
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
