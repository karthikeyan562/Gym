package com.gym.config;

import com.gym.entity.*;
import com.gym.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private SubscriptionPlanRepository planRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private TrainerRepository trainerRepository;

    @Autowired
    private TrainingSessionRepository sessionRepository;

    @Autowired
    private EquipmentRepository equipmentRepository;

    @Autowired
    private EquipmentMaintenanceRepository maintenanceRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedAdmin();
        seedPlans();
        if (memberRepository.count() == 0) {
            seedMembersAndSubscriptions();
            seedTrainersAndSessions();
            seedEquipmentAndMaintenance();
        }
    }

    private void seedAdmin() {
        if (adminRepository.count() == 0) {
            Admin admin = new Admin(
                    "admin",
                    "admin@gym.com",
                    passwordEncoder.encode("admin123"),
                    "Marcus Vance (Head Administrator)"
            );
            adminRepository.save(admin);
            System.out.println(">>> Demo Admin seeded: admin / admin123 (or admin@gym.com)");
        }
    }

    private void seedPlans() {
        if (planRepository.count() == 0) {
            planRepository.save(new SubscriptionPlan(
                    "Monthly Plan", 1, 49.99,
                    "Flexible 30-day all-access membership",
                    "Full gym floor access, Locker room & showers, 1 complimentary fitness assessment"
            ));
            planRepository.save(new SubscriptionPlan(
                    "Quarterly Plan", 3, 129.99,
                    "3-month commitment with priority group classes",
                    "Full gym floor access, Unlimited sauna & steam, Free towel service, 10% discount on supplements"
            ));
            planRepository.save(new SubscriptionPlan(
                    "Half-Yearly Plan", 6, 229.99,
                    "6-month transformation package with trainer consult",
                    "Full gym floor access, 2 personal training sessions included, Nutrition plan template, Guest passes"
            ));
            planRepository.save(new SubscriptionPlan(
                    "Annual Plan", 12, 399.99,
                    "VIP 365-day elite fitness experience",
                    "24/7 unlimited access, 5 personal training sessions, Full body scans every quarter, Free merchandise"
            ));
            System.out.println(">>> 4 Subscription Plans seeded successfully.");
        }
    }

    private void seedMembersAndSubscriptions() {
        List<SubscriptionPlan> plans = planRepository.findAll();
        SubscriptionPlan monthly = plans.get(0);
        SubscriptionPlan quarterly = plans.get(1);
        SubscriptionPlan halfYearly = plans.get(2);
        SubscriptionPlan annual = plans.get(3);

        LocalDate today = LocalDate.now();

        // Member 1 - Active Annual
        Member m1 = new Member();
        m1.setMemberCode("GYM-1001");
        m1.setFullName("Alexander Hayes");
        m1.setAge(28);
        m1.setGender("Male");
        m1.setPhoneNumber("+1 555-234-8901");
        m1.setEmail("alex.hayes@example.com");
        m1.setAddress("442 Hudson St, New York, NY");
        m1.setJoiningDate(today.minusMonths(3));
        m1.setMembershipStatus("ACTIVE");
        m1.setEmergencyContact("Sarah Hayes (+1 555-234-8909)");
        m1.setProfilePhoto("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80");
        m1 = memberRepository.save(m1);

        Subscription s1 = new Subscription();
        s1.setMember(m1);
        s1.setPlan(annual);
        s1.setPlanName(annual.getPlanName());
        s1.setStartDate(m1.getJoiningDate());
        s1.setExpiryDate(m1.getJoiningDate().plusMonths(12));
        s1.setAmount(annual.getAmount());
        s1.setPaymentStatus("PAID");
        s1.setStatus("ACTIVE");
        s1.setPaymentDate(m1.getJoiningDate());
        s1.setNotes("Annual elite member");
        s1 = subscriptionRepository.save(s1);

        Payment p1 = new Payment();
        p1.setInvoiceNumber("INV-2026-001");
        p1.setMember(m1);
        p1.setSubscription(s1);
        p1.setAmount(annual.getAmount());
        p1.setPaymentDate(m1.getJoiningDate());
        p1.setPaymentMethod("CARD");
        p1.setPaymentStatus("PAID");
        p1.setRemarks("Annual membership prepayment");
        paymentRepository.save(p1);

        // Member 2 - Expiring Soon (expires in 4 days)
        Member m2 = new Member();
        m2.setMemberCode("GYM-1002");
        m2.setFullName("Sophia Rodriguez");
        m2.setAge(26);
        m2.setGender("Female");
        m2.setPhoneNumber("+1 555-782-3419");
        m2.setEmail("sophia.r@example.com");
        m2.setAddress("120 Lexington Ave, New York, NY");
        m2.setJoiningDate(today.minusMonths(1).plusDays(4));
        m2.setMembershipStatus("ACTIVE");
        m2.setEmergencyContact("Carlos Rodriguez (+1 555-782-3400)");
        m2.setProfilePhoto("https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80");
        m2 = memberRepository.save(m2);

        Subscription s2 = new Subscription();
        s2.setMember(m2);
        s2.setPlan(monthly);
        s2.setPlanName(monthly.getPlanName());
        s2.setStartDate(m2.getJoiningDate());
        s2.setExpiryDate(today.plusDays(4)); // Expiring in 4 days!
        s2.setAmount(monthly.getAmount());
        s2.setPaymentStatus("PAID");
        s2.setStatus("ACTIVE");
        s2.setPaymentDate(m2.getJoiningDate());
        s2.setNotes("Renewal reminder sent via SMS");
        s2 = subscriptionRepository.save(s2);

        Payment p2 = new Payment();
        p2.setInvoiceNumber("INV-2026-002");
        p2.setMember(m2);
        p2.setSubscription(s2);
        p2.setAmount(monthly.getAmount());
        p2.setPaymentDate(m2.getJoiningDate());
        p2.setPaymentMethod("UPI");
        p2.setPaymentStatus("PAID");
        p2.setRemarks("Monthly plan subscription");
        paymentRepository.save(p2);

        // Member 3 - Expired
        Member m3 = new Member();
        m3.setMemberCode("GYM-1003");
        m3.setFullName("Marcus Sterling");
        m3.setAge(34);
        m3.setGender("Male");
        m3.setPhoneNumber("+1 555-901-2384");
        m3.setEmail("marcus.sterling@example.com");
        m3.setAddress("78 Park Avenue, Brooklyn, NY");
        m3.setJoiningDate(today.minusMonths(4));
        m3.setMembershipStatus("EXPIRED");
        m3.setEmergencyContact("Emma Sterling (+1 555-901-2380)");
        m3.setProfilePhoto("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80");
        m3 = memberRepository.save(m3);

        Subscription s3 = new Subscription();
        s3.setMember(m3);
        s3.setPlan(quarterly);
        s3.setPlanName(quarterly.getPlanName());
        s3.setStartDate(m3.getJoiningDate());
        s3.setExpiryDate(today.minusDays(10)); // Expired 10 days ago
        s3.setAmount(quarterly.getAmount());
        s3.setPaymentStatus("PAID");
        s3.setStatus("EXPIRED");
        s3.setPaymentDate(m3.getJoiningDate());
        s3.setNotes("Needs follow up for quarterly renewal");
        s3 = subscriptionRepository.save(s3);

        Payment p3 = new Payment();
        p3.setInvoiceNumber("INV-2026-003");
        p3.setMember(m3);
        p3.setSubscription(s3);
        p3.setAmount(quarterly.getAmount());
        p3.setPaymentDate(m3.getJoiningDate());
        p3.setPaymentMethod("CARD");
        p3.setPaymentStatus("PAID");
        p3.setRemarks("Quarterly subscription");
        paymentRepository.save(p3);

        // Member 4 - Active Half-Yearly
        Member m4 = new Member();
        m4.setMemberCode("GYM-1004");
        m4.setFullName("Elena Rostova");
        m4.setAge(24);
        m4.setGender("Female");
        m4.setPhoneNumber("+1 555-312-7744");
        m4.setEmail("elena.rostova@example.com");
        m4.setAddress("88 Franklin Blvd, Jersey City, NJ");
        m4.setJoiningDate(today.minusMonths(2));
        m4.setMembershipStatus("ACTIVE");
        m4.setEmergencyContact("Dmitri Rostov (+1 555-312-7700)");
        m4.setProfilePhoto("https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80");
        m4 = memberRepository.save(m4);

        Subscription s4 = new Subscription();
        s4.setMember(m4);
        s4.setPlan(halfYearly);
        s4.setPlanName(halfYearly.getPlanName());
        s4.setStartDate(m4.getJoiningDate());
        s4.setExpiryDate(m4.getJoiningDate().plusMonths(6));
        s4.setAmount(halfYearly.getAmount());
        s4.setPaymentStatus("PAID");
        s4.setStatus("ACTIVE");
        s4.setPaymentDate(m4.getJoiningDate());
        s4.setNotes("Half-Yearly fitness plan");
        s4 = subscriptionRepository.save(s4);

        Payment p4 = new Payment();
        p4.setInvoiceNumber("INV-2026-004");
        p4.setMember(m4);
        p4.setSubscription(s4);
        p4.setAmount(halfYearly.getAmount());
        p4.setPaymentDate(m4.getJoiningDate());
        p4.setPaymentMethod("CASH");
        p4.setPaymentStatus("PAID");
        p4.setRemarks("Half-Yearly cash receipt");
        paymentRepository.save(p4);

        // Member 5 - Active Monthly
        Member m5 = new Member();
        m5.setMemberCode("GYM-1005");
        m5.setFullName("David Chen");
        m5.setAge(31);
        m5.setGender("Male");
        m5.setPhoneNumber("+1 555-667-9102");
        m5.setEmail("david.chen@example.com");
        m5.setAddress("512 Broadway, Manhattan, NY");
        m5.setJoiningDate(today.minusDays(12));
        m5.setMembershipStatus("ACTIVE");
        m5.setEmergencyContact("Linda Chen (+1 555-667-9100)");
        m5.setProfilePhoto("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80");
        m5 = memberRepository.save(m5);

        Subscription s5 = new Subscription();
        s5.setMember(m5);
        s5.setPlan(monthly);
        s5.setPlanName(monthly.getPlanName());
        s5.setStartDate(m5.getJoiningDate());
        s5.setExpiryDate(m5.getJoiningDate().plusMonths(1));
        s5.setAmount(monthly.getAmount());
        s5.setPaymentStatus("PAID");
        s5.setStatus("ACTIVE");
        s5.setPaymentDate(m5.getJoiningDate());
        s5.setNotes("Monthly gym access");
        s5 = subscriptionRepository.save(s5);

        Payment p5 = new Payment();
        p5.setInvoiceNumber("INV-2026-005");
        p5.setMember(m5);
        p5.setSubscription(s5);
        p5.setAmount(monthly.getAmount());
        p5.setPaymentDate(m5.getJoiningDate());
        p5.setPaymentMethod("CARD");
        p5.setPaymentStatus("PAID");
        p5.setRemarks("Monthly plan payment via Stripe");
        paymentRepository.save(p5);

        // Member 6 - Expiring in 2 days
        Member m6 = new Member();
        m6.setMemberCode("GYM-1006");
        m6.setFullName("Jessica Miller");
        m6.setAge(29);
        m6.setGender("Female");
        m6.setPhoneNumber("+1 555-882-1405");
        m6.setEmail("jessica.m@example.com");
        m6.setAddress("203 West 4th St, Greenwich, NY");
        m6.setJoiningDate(today.minusMonths(1).plusDays(2));
        m6.setMembershipStatus("ACTIVE");
        m6.setEmergencyContact("Brian Miller (+1 555-882-1400)");
        m6.setProfilePhoto("https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80");
        m6 = memberRepository.save(m6);

        Subscription s6 = new Subscription();
        s6.setMember(m6);
        s6.setPlan(monthly);
        s6.setPlanName(monthly.getPlanName());
        s6.setStartDate(m6.getJoiningDate());
        s6.setExpiryDate(today.plusDays(2)); // Expiring in 2 days!
        s6.setAmount(monthly.getAmount());
        s6.setPaymentStatus("PAID");
        s6.setStatus("ACTIVE");
        s6.setPaymentDate(m6.getJoiningDate());
        s6.setNotes("Expiring in 2 days, renewal pending");
        s6 = subscriptionRepository.save(s6);

        Payment p6 = new Payment();
        p6.setInvoiceNumber("INV-2026-006");
        p6.setMember(m6);
        p6.setSubscription(s6);
        p6.setAmount(monthly.getAmount());
        p6.setPaymentDate(m6.getJoiningDate());
        p6.setPaymentMethod("UPI");
        p6.setPaymentStatus("PAID");
        p6.setRemarks("Monthly membership fees");
        paymentRepository.save(p6);
    }

    private void seedTrainersAndSessions() {
        // Trainer 1
        Trainer t1 = new Trainer();
        t1.setTrainerCode("TRN-101");
        t1.setName("Viktor Kane");
        t1.setSpecialization("Strength & Conditioning");
        t1.setExperience("8 Years");
        t1.setContactNumber("+1 555-714-9988");
        t1.setEmail("viktor.kane@gym.com");
        t1.setMonthlySalary(3800.0);
        t1.setBio("Former Olympic lifting coach specializing in barbell biomechanics, powerlifting, and muscle hypertrophy.");
        t1.setProfilePhoto("https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&auto=format&fit=crop&q=80");
        t1 = trainerRepository.save(t1);

        // Trainer 2
        Trainer t2 = new Trainer();
        t2.setTrainerCode("TRN-102");
        t2.setName("Samantha Drake");
        t2.setSpecialization("CrossFit & High Intensity (HIIT)");
        t2.setExperience("6 Years");
        t2.setContactNumber("+1 555-433-2190");
        t2.setEmail("samantha.d@gym.com");
        t2.setMonthlySalary(3400.0);
        t2.setBio("Certified CSCS and CrossFit Level 3 coach focusing on metabolic conditioning and functional athletic strength.");
        t2.setProfilePhoto("https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&auto=format&fit=crop&q=80");
        t2 = trainerRepository.save(t2);

        // Trainer 3
        Trainer t3 = new Trainer();
        t3.setTrainerCode("TRN-103");
        t3.setName("Marcus Brody");
        t3.setSpecialization("Bodybuilding & Physique Prep");
        t3.setExperience("10 Years");
        t3.setContactNumber("+1 555-921-6543");
        t3.setEmail("marcus.brody@gym.com");
        t3.setMonthlySalary(4200.0);
        t3.setBio("IFBB pro mentor focused on progressive overload, aesthetic physique building, and body recomposition.");
        t3.setProfilePhoto("https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&auto=format&fit=crop&q=80");
        t3 = trainerRepository.save(t3);

        // Trainer 4
        Trainer t4 = new Trainer();
        t4.setTrainerCode("TRN-104");
        t4.setName("Aria Thorne");
        t4.setSpecialization("Yoga & Joint Mobility Recovery");
        t4.setExperience("5 Years");
        t4.setContactNumber("+1 555-832-1100");
        t4.setEmail("aria.thorne@gym.com");
        t4.setMonthlySalary(3100.0);
        t4.setBio("Sports physiotherapist and yoga practitioner specializing in injury prevention, flexibility, and post-lift recovery.");
        t4.setProfilePhoto("https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop&q=80");
        t4 = trainerRepository.save(t4);

        // Training Sessions
        List<Member> members = memberRepository.findAll();
        LocalDate today = LocalDate.now();

        if (members.size() >= 3) {
            // Session 1: Viktor with Alex today 09:00 - 10:00
            TrainingSession s1 = new TrainingSession();
            s1.setMember(members.get(0));
            s1.setTrainer(t1);
            s1.setTrainingDate(today);
            s1.setStartTime(LocalTime.of(9, 0));
            s1.setEndTime(LocalTime.of(10, 0));
            s1.setSessionStatus("SCHEDULED");
            s1.setNotes("Heavy Deadlift & Barbell Rows form check");
            sessionRepository.save(s1);

            // Session 2: Samantha with Sophia today 11:00 - 12:00
            TrainingSession s2 = new TrainingSession();
            s2.setMember(members.get(1));
            s2.setTrainer(t2);
            s2.setTrainingDate(today);
            s2.setStartTime(LocalTime.of(11, 0));
            s2.setEndTime(LocalTime.of(12, 0));
            s2.setSessionStatus("SCHEDULED");
            s2.setNotes("Metabolic Conditioning Circuit & Kettlebells");
            sessionRepository.save(s2);

            // Session 3: Marcus with David tomorrow 15:00 - 16:00
            TrainingSession s3 = new TrainingSession();
            s3.setMember(members.get(4));
            s3.setTrainer(t3);
            s3.setTrainingDate(today.plusDays(1));
            s3.setStartTime(LocalTime.of(15, 0));
            s3.setEndTime(LocalTime.of(16, 0));
            s3.setSessionStatus("SCHEDULED");
            s3.setNotes("Chest & Triceps hypertrophy volume phase");
            sessionRepository.save(s3);

            // Session 4: Aria with Elena yesterday (Completed)
            TrainingSession s4 = new TrainingSession();
            s4.setMember(members.get(3));
            s4.setTrainer(t4);
            s4.setTrainingDate(today.minusDays(1));
            s4.setStartTime(LocalTime.of(8, 0));
            s4.setEndTime(LocalTime.of(9, 0));
            s4.setSessionStatus("COMPLETED");
            s4.setNotes("Hip mobility and lower back decompression completed");
            sessionRepository.save(s4);
        }
        System.out.println(">>> Trainers and training sessions seeded.");
    }

    private void seedEquipmentAndMaintenance() {
        LocalDate today = LocalDate.now();

        // 1. Treadmill
        Equipment eq1 = new Equipment();
        eq1.setEquipmentCode("EQ-101");
        eq1.setEquipmentName("Matrix Commercial High-Speed Treadmill T70");
        eq1.setEquipmentImage("https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&auto=format&fit=crop&q=80");
        eq1.setCategory("Cardio");
        eq1.setQuantity(6);
        eq1.setPurchaseDate(today.minusMonths(14));
        eq1.setPurchaseCost(4500.0);
        eq1.setCondition("GOOD");
        eq1.setLastMaintenanceDate(today.minusMonths(1));
        eq1.setNextMaintenanceDate(today.plusMonths(2));
        eq1 = equipmentRepository.save(eq1);

        // 2. Dumbbell Set
        Equipment eq2 = new Equipment();
        eq2.setEquipmentCode("EQ-102");
        eq2.setEquipmentName("Rogue Urethane Dumbbell Set (5kg - 50kg)");
        eq2.setEquipmentImage("https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80");
        eq2.setCategory("Free Weights");
        eq2.setQuantity(20);
        eq2.setPurchaseDate(today.minusMonths(18));
        eq2.setPurchaseCost(5200.0);
        eq2.setCondition("GOOD");
        eq2.setLastMaintenanceDate(today.minusMonths(2));
        eq2.setNextMaintenanceDate(today.plusMonths(4));
        eq2 = equipmentRepository.save(eq2);

        // 3. Olympic Barbells & Plates
        Equipment eq3 = new Equipment();
        eq3.setEquipmentCode("EQ-103");
        eq3.setEquipmentName("Eleiko Olympic Competition Barbells & Bumper Plates");
        eq3.setEquipmentImage("https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80");
        eq3.setCategory("Free Weights");
        eq3.setQuantity(10);
        eq3.setPurchaseDate(today.minusMonths(10));
        eq3.setPurchaseCost(3800.0);
        eq3.setCondition("GOOD");
        eq3.setLastMaintenanceDate(today.minusMonths(1));
        eq3.setNextMaintenanceDate(today.plusMonths(3));
        eq3 = equipmentRepository.save(eq3);

        // 4. Incline / Flat Bench Press
        Equipment eq4 = new Equipment();
        eq4.setEquipmentCode("EQ-104");
        eq4.setEquipmentName("Hammer Strength Heavy Duty Olympic Bench Press");
        eq4.setEquipmentImage("https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&auto=format&fit=crop&q=80");
        eq4.setCategory("Strength Machines");
        eq4.setQuantity(4);
        eq4.setPurchaseDate(today.minusMonths(16));
        eq4.setPurchaseCost(2900.0);
        eq4.setCondition("NEEDS_REPAIR");
        eq4.setLastMaintenanceDate(today.minusMonths(4));
        eq4.setNextMaintenanceDate(today.plusDays(5));
        eq4 = equipmentRepository.save(eq4);

        // 5. 45-Degree Leg Press Machine
        Equipment eq5 = new Equipment();
        eq5.setEquipmentCode("EQ-105");
        eq5.setEquipmentName("Cybex Platinum 45-Degree Plate-Loaded Leg Press");
        eq5.setEquipmentImage("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80");
        eq5.setCategory("Strength Machines");
        eq5.setQuantity(3);
        eq5.setPurchaseDate(today.minusMonths(12));
        eq5.setPurchaseCost(6400.0);
        eq5.setCondition("GOOD");
        eq5.setLastMaintenanceDate(today.minusMonths(1));
        eq5.setNextMaintenanceDate(today.plusMonths(2));
        eq5 = equipmentRepository.save(eq5);

        // 6. Dual Adjustable Cable Crossover
        Equipment eq6 = new Equipment();
        eq6.setEquipmentCode("EQ-106");
        eq6.setEquipmentName("Life Fitness Pro2 Dual Adjustable Pulley Cable Machine");
        eq6.setEquipmentImage("https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=600&auto=format&fit=crop&q=80");
        eq6.setCategory("Cable Machines");
        eq6.setQuantity(2);
        eq6.setPurchaseDate(today.minusMonths(20));
        eq6.setPurchaseCost(7200.0);
        eq6.setCondition("UNDER_MAINTENANCE");
        eq6.setLastMaintenanceDate(today.minusDays(5));
        eq6.setNextMaintenanceDate(today.plusDays(3));
        eq6 = equipmentRepository.save(eq6);

        // 7. Commercial Spin Exercise Bikes
        Equipment eq7 = new Equipment();
        eq7.setEquipmentCode("EQ-107");
        eq7.setEquipmentName("Keiser M3i Indoor Bluetooth Spin Studio Bike");
        eq7.setEquipmentImage("https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=600&auto=format&fit=crop&q=80");
        eq7.setCategory("Cardio");
        eq7.setQuantity(8);
        eq7.setPurchaseDate(today.minusMonths(8));
        eq7.setPurchaseCost(3600.0);
        eq7.setCondition("GOOD");
        eq7.setLastMaintenanceDate(today.minusMonths(2));
        eq7.setNextMaintenanceDate(today.plusMonths(1));
        eq7 = equipmentRepository.save(eq7);

        // Maintenance Logs
        EquipmentMaintenance m1 = new EquipmentMaintenance();
        m1.setEquipment(eq6);
        m1.setMaintenanceDate(today.minusDays(5));
        m1.setMaintenanceCost(180.0);
        m1.setTechnicianName("Robert Vance (Apex Tech Services)");
        m1.setDescription("Replaced frayed steel pulley cable on left weight stack and lubricated guide rods.");
        m1.setStatus("IN_PROGRESS");
        m1.setResolutionNotes("Replacement cable installed. Calibration check pending.");
        maintenanceRepository.save(m1);

        EquipmentMaintenance m2 = new EquipmentMaintenance();
        m2.setEquipment(eq1);
        m2.setMaintenanceDate(today.minusMonths(1));
        m2.setMaintenanceCost(250.0);
        m2.setTechnicianName("Apex Tech Services");
        m2.setDescription("Quarterly motor inspection, belt centering and running deck waxing.");
        m2.setStatus("COMPLETED");
        m2.setResolutionNotes("All 6 treadmill units running at optimal motor wattage.");
        maintenanceRepository.save(m2);

        System.out.println(">>> 7 Gym Equipment items and maintenance records seeded.");
    }
}
