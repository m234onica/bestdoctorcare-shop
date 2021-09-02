<template>
    <div v-if="loading" class="loadingUI">
        <div class="cp-spinner cp-hue"></div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loading: false,
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.$nuxt.$loading.start();
            setTimeout(() => this.$nuxt.$loading.finish(), 500);
        });
    },
    methods: {
        start() {
            this.loading = true;
        },
        finish() {
            this.loading = false;
        },
    },
};
</script>

<style scoped>
.loadingUI {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 10000;
}
.cp-spinner {
    width: 48px;
    height: 48px;
    display: inline-block;
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.cp-hue {
    width: 48px;
    height: 48px;
    display: inline-block;
    box-sizing: border-box;
    background: #f56151;
    border-radius: 50%;
    animation: cp-hue-animate 1s ease-in-out infinite;
}
.cp-hue:before {
    border-radius: 0 24px 24px 0;
    content: " ";
    width: 24px;
    height: 48px;
    display: inline-block;
    box-sizing: border-box;
    background: #fff;
    position: absolute;
    top: 0;
    right: 0;
    animation: cp-hue-animate-before 1s ease-in-out infinite;
}
@keyframes cp-hue-animate {
    0% {
        background: #0044bc;
    }
    25% {
        background: #673ab7;
    }
    50% {
        background: #d32f2f;
    }
    75% {
        background: #673ab7;
    }
    100% {
        background: #0044bc;
    }
}
@keyframes cp-hue-animate-before {
    0% {
        transform: rotateY(0);
        transform-origin: left center;
        opacity: 0.5;
    }
    30%,
    70% {
        transform: rotateY(180deg);
        transform-origin: left center;
        opacity: 0.2;
    }
    100% {
        transform: rotateY(0);
        opacity: 0.5;
    }
}
</style>
