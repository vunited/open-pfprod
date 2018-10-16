package com.sm.pfprod.web.portal.system.org;

import com.alibaba.fastjson.JSON;
import com.sm.open.care.core.enums.YesOrNoNum;
import com.sm.open.care.core.utils.DateUtil;
import com.sm.pfprod.model.dto.system.org.PfOrgAuthDto;
import com.sm.pfprod.model.dto.system.org.PfOrgDto;
import com.sm.pfprod.model.entity.SysOrg;
import com.sm.pfprod.model.result.PageResult;
import com.sm.pfprod.service.system.org.PfOrgService;
import com.sm.pfprod.web.portal.BaseController;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.Date;

/**
 * @ClassName: PfOrgController
 * @Description: 机构管理
 * @Author yangtongbin
 * @Date 2018/9/20 10:47
 */
@Controller
@RequestMapping(value = "/pf/p/org")
public class PfOrgController extends BaseController {

    @Resource
    private PfOrgService pfOrgService;

    /**
     * 机构试用到期提醒
     */
    @Value("${org.expiry.notice.day}")
    private int orgExpiryNoticeDay = 30;

    @PreAuthorize("hasAnyRole('ROLE_ORG_MG','ROLE_SUPER')")
    @RequestMapping("/page")
    public String page() {
        return "pages/system/org/org";
    }

    @PreAuthorize("hasAnyRole('ROLE_ORG_MG','ROLE_SUPER')")
    @RequestMapping("/page/auth")
    public String orgAuth() {
        return "pages/system/org/orgAuth";
    }

    @PreAuthorize("hasAnyRole('ROLE_ORG_MG', 'ROLE_ORG_DETAIL', 'ROLE_SUPER')")
    @RequestMapping("/form")
    public String form(String formType, Long idOrg, String position, Model model) {
        model.addAttribute("formType", formType);
        model.addAttribute("position", position);
        if (idOrg != null) {
            SysOrg sysOrg = pfOrgService.selectOrgInfoById(idOrg);
            model.addAttribute("orgInfo", JSON.toJSONString(sysOrg));
            model.addAttribute("fgActive", sysOrg.getFgActive());
            if (sysOrg.getFgActive().equals(YesOrNoNum.YES.getCode()) && StringUtils.isNotBlank(sysOrg.getGmtValid())) {
                Date gmtValid = DateUtil.parseDate(sysOrg.getGmtValid());
                model.addAttribute("renewFlag", gmtValid.before(DateUtil.addDate(gmtValid, orgExpiryNoticeDay)));
            }
        }
        return "pages/system/org/orgForm";
    }

    /**
     * 获取机构列表
     *
     * @param dto
     * @return
     */
    @PreAuthorize("hasAnyRole('ROLE_ORG_MG','ROLE_SUPER')")
    @RequestMapping(value = "/list")
    @ResponseBody
    public PageResult listOrgs(PfOrgDto dto) {
        // 临过期
        if (dto.isExpired()) {
            dto.setGmtValid(DateUtil.date2Str(DateUtil.addDate(new Date(), orgExpiryNoticeDay)));
        }
        return pfOrgService.listOrgs(dto);
    }

    /**
     * 获取机构认证列表
     *
     * @param dto
     * @return
     */
    @PreAuthorize("hasAnyRole('ROLE_OM0020','ROLE_SUPER')")
    @RequestMapping(value = "/list/auth")
    @ResponseBody
    public PageResult listAuthOrgs(PfOrgAuthDto dto) {
        return pfOrgService.listAuthOrg(dto);
    }


}
