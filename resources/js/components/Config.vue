<template>
    <div class="row">
        <div class="col-md-8 offset-2">
            <div class="form-group row">
                <label for="width" class="col-sm-2 col-form-label">Width: </label>
                <div class="col-md-10">
                    <input type="number"
                           class="form-control"
                           :class="{'border-danger': validations.width}"
                           v-model="width"
                           id="width"/>
                    <span class="text-danger" v-if="validations.width">Enter a value other than 0</span>
                </div>
            </div>
            <div class="form-group row">
                <label for="height" class="col-sm-2 col-form-label">Height: </label>
                <div class="col-md-10">
                    <input type="number"
                           class="form-control"
                           :class="{'border-danger': validations.height}"
                           v-model="height"
                           id="height"/>
                    <span class="text-danger" v-if="validations.height">Enter a value other than 0</span>
                </div>
            </div>
            <div class="form-group row">
                <label for="mines" class="col-sm-2 col-form-label">Mines: </label>
                <div class="col-md-10">
                    <input type="number"
                           class="form-control"
                           :class="{'border-danger': validations.mines}"
                           v-model="mines"
                           id="mines"
                           :placeholder="'Max ' + max"/>
                    <span class="text-danger" v-if="validations.mines">Wrong value: not 0 and not more then {{ max }}</span>
                </div>
            </div>
            <button class="btn btn-lg btn-success" @click="onPlayClick">Play</button>
        </div>
    </div>
</template>

<script>
    export default {
        data: function() {
            return {
                width: 15,
                height: 15,
                mines: 100,
                validations: {
                    width: false,
                    height: false,
                    mines: false,
                }
            }
        },

        computed: {
            max() {
                return this.width * this. height;
            },
        },

        methods: {
            onPlayClick() {
                if (this.validate()) {
                    this.$router.push({name: 'game', params: { width: this.width, height: this.height, mines: this.mines}});
                }
            },

            validate() {
                let valid = true;
                this.validations.width = false;
                this.validations.height = false;
                this.validations.mines = false;

                if (this.width === 0 || this.width === '0') {
                    valid = false;
                    this.validations.width = true;
                }
                if (this.height === 0 || this.height === '0') {
                    valid = false;
                    this.validations.height = true;
                }
                if (this.mines === '0' || this.mines === 0 || this.mines > this.max) {
                    valid = false;
                    this.validations.mines = true;
                }

                return valid;
            }
        }
    }
</script>
