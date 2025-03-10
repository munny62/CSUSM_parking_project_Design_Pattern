#pragma once
#include <memory>
#include "../reservation/Reservation.hpp"
#include "../state/SpotState.hpp"

// State Pattern
class ParkingSpot {
private:
    int spotId;
    std::shared_ptr<SpotState> currentState;
    std::shared_ptr<Reservation> currentReservation;
    
public:
    ParkingSpot(int spotId);
    bool isAvailable() const;
    bool isReservable(const TimeSlot& timeSlot) const;
    void setState(std::shared_ptr<SpotState> state);
    void setReservation(std::shared_ptr<Reservation> reservation);
};