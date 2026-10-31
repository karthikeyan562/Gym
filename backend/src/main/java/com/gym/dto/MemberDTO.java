package com.gym.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class MemberDTO {
    private Long id;
    private String memberCode;

    @NotBlank(message = "Full name is required")
    private String fullName;

    private String profilePhoto;

    @NotNull(message = "Age is required")
    private Integer age;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String address;
    private LocalDate joiningDate;
    private String membershipStatus;
    private String emergencyContact;

    // Optional initial subscription upon registration
    private Long initialPlanId;
    private String initialPaymentMethod;

    public MemberDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMemberCode() { return memberCode; }
    public void setMemberCode(String memberCode) { this.memberCode = memberCode; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getProfilePhoto() { return profilePhoto; }
    public void setProfilePhoto(String profilePhoto) { this.profilePhoto = profilePhoto; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public LocalDate getJoiningDate() { return joiningDate; }
    public void setJoiningDate(LocalDate joiningDate) { this.joiningDate = joiningDate; }

    public String getMembershipStatus() { return membershipStatus; }
    public void setMembershipStatus(String membershipStatus) { this.membershipStatus = membershipStatus; }

    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }

    public Long getInitialPlanId() { return initialPlanId; }
    public void setInitialPlanId(Long initialPlanId) { this.initialPlanId = initialPlanId; }

    public String getInitialPaymentMethod() { return initialPaymentMethod; }
    public void setInitialPaymentMethod(String initialPaymentMethod) { this.initialPaymentMethod = initialPaymentMethod; }
}
