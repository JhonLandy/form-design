<script>
export default {
    data() {
        return {
            form: {
                name: "",
                sex: "",
                born: "",
                age: "",
                marry: "",
                parent: "",
                mark: "",
            },
        }
    },
}
</script>

<template>
    <el-form class="form-root" :model="form" label-width="60">
        <el-row>
            <el-form-item label="姓名" prop="name">
                <el-input
                    v-model="form.name"
                    placeholder="输入框"
                    :width="null"
                    class="form-comp-style"
                />
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-select
                    v-model="form.sex"
                    placeholder="下拉框"
                    :width="null"
                    class="form-comp-style"
                >
                    <el-option value="item1" label="item1" />
                    <el-option value="item2" label="item2" />
                </el-select>
            </el-form-item>
        </el-row>
        <el-row>
            <el-form-item label="出生" prop="born">
                <el-time-select
                    v-model="form.born"
                    placeholder="时间下拉框"
                    :width="null"
                    class="form-comp-style"
                />
            </el-form-item>
            <el-form-item label="年龄" prop="age">
                <el-input-number
                    v-model="form.age"
                    :min="0"
                    placeholder="计数器"
                    :width="null"
                    class="form-comp-style"
                />
            </el-form-item>
        </el-row>
        <el-row>
            <el-form-item label="婚宴" prop="marry">
                <el-radio-group
                    v-model="form.marry"
                    :width="null"
                    class="form-comp-style"
                >
                    <el-radio value="单选1" label="单选1" />
                    <el-radio value="单选2" label="单选2" />
                </el-radio-group>
            </el-form-item>
            <el-form-item label="父母" prop="parent">
                <el-checkbox-group
                    v-model="form.parent"
                    :width="null"
                    class="form-comp-style"
                >
                    <el-checkbox value="多选1" label="多选1" />
                    <el-checkbox value="多选2" label="多选2" />
                </el-checkbox-group>
            </el-form-item>
        </el-row>
        <el-row>
            <el-form-item label="描述" prop="mark">
                <el-input
                    v-model="form.mark"
                    maxlength="256"
                    type="textarea"
                    placeholder="输入框"
                    :width="432"
                    :style="{ width: '432px' }"
                    class="form-comp-style"
                />
            </el-form-item>
        </el-row>
        <el-row>
            <el-form-item>
                <el-button type="primary" :width="null" class="form-comp-style">
                    默认按钮
                </el-button>
            </el-form-item>
        </el-row>
    </el-form>
</template>

<style lang='scss' scoped>
.form-root {
    padding: 10px;
}

.form-comp-style {
    width: 166px;
}
</style>
