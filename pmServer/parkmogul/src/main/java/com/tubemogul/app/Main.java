package com.tubemogul.app;

import io.dropwizard.Application;
import io.dropwizard.setup.Environment;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;



public class Main extends Application<ParkMogulConfiguration> {
    private int totalSpotsAvailable;
    private Cars cars = new Cars();

    @Override
    public void run(ParkMogulConfiguration conf, Environment env) throws Exception {
        totalSpotsAvailable = conf.parkingCapacity;

        env.jersey().register(new CarSeen());
        env.jersey().register(new AvailableSpots());
    }

    public static void main(String[] args) throws Exception {
        new Main().run(args);
    }

    @Path("/car-seen")
    public class CarSeen {

        @POST
        public int carSeen(@QueryParam("plate") String plate) {
            cars.put(plate);
            return 0;
        }
    }

    @Path("/get-available-spots")
    @Produces(MediaType.APPLICATION_JSON)
    public class AvailableSpots {

        @GET
        public String get() {
            int availableSpots = Math.max(totalSpotsAvailable - cars.total(), 0);

            return "response= {\"spots\":" + availableSpots + "}";
        }
    }
}
