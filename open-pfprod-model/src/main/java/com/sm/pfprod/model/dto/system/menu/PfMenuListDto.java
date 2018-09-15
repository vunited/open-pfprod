package com.sm.pfprod.model.dto.system.menu;

import com.sm.pfprod.model.dto.common.PfCommonListDto;

import java.io.Serializable;

public class PfMenuListDto extends PfCommonListDto implements Serializable {

    private static final long serialVersionUID = 321752553115657904L;

    private String status;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
