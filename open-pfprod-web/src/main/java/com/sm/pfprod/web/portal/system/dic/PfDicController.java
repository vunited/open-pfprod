package com.sm.pfprod.web.portal.system.dic;

import com.sm.pfprod.model.dto.system.dic.PfDicDto;
import com.sm.pfprod.model.result.PageResult;
import com.sm.pfprod.service.system.dic.PfDicService;
import com.sm.pfprod.web.portal.BaseController;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;

/**
 * @ClassName: PfParamRestController
 * @Description: 参数管理
 * @Author yangtongbin
 * @Date 2017/10/9 11:05
 */
@Controller
@RequestMapping(value = "/pf/p/dic")
public class PfDicController extends BaseController {

    @Resource
    private PfDicService pfDicService;

    @PreAuthorize("hasAnyRole('ROLE_DIC_MG','ROLE_SUPER')")
    @RequestMapping("/page")
    public String page() {
        return "pages/system/dic/dicPage";
    }

    @PreAuthorize("hasAnyRole('ROLE_DIC_MG','ROLE_SUPER')")
    @RequestMapping("/form")
    public String form(String formType, Model model) {
        model.addAttribute("formType", formType);
        return "pages/system/dic/dicForm";
    }

    @PreAuthorize("hasAnyRole('ROLE_DIC_MG','ROLE_SUPER')")
    @RequestMapping("/enum/form")
    public String enumForm(String formType, Model model) {
        model.addAttribute("formType", formType);
        return "pages/system/dic/enumForm";
    }

    /**
     * 获取字典分组
     */
    @PreAuthorize("hasAnyRole('ROLE_DIC_MG','ROLE_SUPER')")
    @RequestMapping(value = "/list")
    @ResponseBody
    public PageResult listDicGroups(PfDicDto dto) {
        return pfDicService.listDicGroups(dto);
    }

    /**
     * 获取字典枚举
     */
    @PreAuthorize("hasAnyRole('ROLE_DIC_MG','ROLE_SUPER')")
    @RequestMapping(value = "/enum/list")
    @ResponseBody
    public PageResult listEnums(PfDicDto dto) {
        return pfDicService.listEnums(dto);
    }
}
