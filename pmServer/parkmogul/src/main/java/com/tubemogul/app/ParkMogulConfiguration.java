package com.tubemogul.app;

import io.dropwizard.Configuration;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ParkMogulConfiguration extends Configuration {
    @JsonProperty
    public int parkingCapacity;
}
