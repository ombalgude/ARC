"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var generator_1 = require("./packages/fitness-core/src/workouts/generator");
var envs = ['gym', 'home'];
var equips = [[], ['dumbbell']];
var levels = ['beginner', 'intermediate', 'advanced'];
for (var _i = 0, envs_1 = envs; _i < envs_1.length; _i++) {
    var env = envs_1[_i];
    for (var _a = 0, equips_1 = equips; _a < equips_1.length; _a++) {
        var eq = equips_1[_a];
        for (var _b = 0, levels_1 = levels; _b < levels_1.length; _b++) {
            var lvl = levels_1[_b];
            try {
                (0, generator_1.generateWorkoutPlan)({ goals: ['build_muscle'], experienceLevel: lvl, workoutFrequency: 3, environment: env, equipment: eq });
            }
            catch (e) {
                console.log('FAILED FOR:', { env: env, eq: eq, lvl: lvl }, e.message);
            }
        }
    }
}
