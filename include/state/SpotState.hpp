#pragma once

// State Pattern
class SpotState {
public:
    virtual ~SpotState() = default;
    virtual bool isAvailable() const = 0;
    virtual bool isReservable() const = 0;
};