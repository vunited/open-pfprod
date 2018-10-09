package com.sm.pfprod.model.enums;

/**
 * @ClassName: SysDicGroupEnum
 * @Description: 字典分组枚举
 * @Author yangtongbin
 * @Date 2018/8/26 23:16
 */
public enum SysDicGroupEnum {

    AREA_CODE("AREA_CODE", "城市编码"),
    SYS_PARAM_BIZ_MODUAL("SYS_PARAM_BIZ_MODULE", "系统参数-作用模块"),
    BANNER_POSITION("BANNER_POSITION", "banner位"),
    EXAM_WAYS("EXAM_WAYS", "检查方式"),
    BODY_POSITION("BODY_POSITION", "检查题库"),
    CLINIC_TEMPLATE_TAG("CLINIC_TEMPLATE_TAG", "模板标签");

    private String code;
    private String desc;

    private SysDicGroupEnum(String code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    public String getCode() {
        return code;
    }

    public String getDesc() {
        return desc;
    }
}
