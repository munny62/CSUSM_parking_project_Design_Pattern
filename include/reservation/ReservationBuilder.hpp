#pragma once
#include <memory>
#include "Reservation.hpp"
#include "../user/User.hpp"
#include "../parking/ParkingSpot.hpp"

// Builder Pattern
class ReservationBuilder {
private:
    std::shared_ptr<User> user;
    std::shared_ptr<ParkingSpot> spot;
    TimeSlot timeSlot;
    
public:
    ReservationBuilder& setUser(std::shared_ptr<User> user);
    ReservationBuilder& setSpot(std::shared_ptr<ParkingSpot> spot);
    ReservationBuilder& setTimeSlot(const TimeSlot& timeSlot);
    std::shared_ptr<Reservation> build();
};