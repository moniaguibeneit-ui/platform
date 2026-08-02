package com.socialcommerce.platform.user.entity;

import com.socialcommerce.platform.common.entity.TenantAwareEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class Role extends TenantAwareEntity {

    @Column(nullable = false, length = 50)
    private String name;
}
