package com.socialcommerce.platform.user.dto;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRequest {
    @NotBlank
    @Size(max = 150)
    private String email;

    @Size(min = 6)
    private String password; // optional on update

    @Size(max = 80)
    private String firstName;

    @Size(max = 80)
    private String lastName;

    private Boolean active;

    private List<UUID> roleIds;
}
