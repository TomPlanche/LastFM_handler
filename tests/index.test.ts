/**
 * @file tests/index.test.ts
 * @description This file contains the tests for the LastFM_handler class.
 *
 * @author Tom Planche
 * @license unlicense
 */

import LastFM_handler, {
  T_UserInfoRes,
  UsernameNotFoundError
} from "../LasfFM_handler";

describe("LastFM_handler", () => {
  it("should return the same instance", () => {
    const instance1 = LastFM_handler.getInstance();
    const instance2 = LastFM_handler.getInstance();

    expect(instance1).toBe(instance2);
  });

  it("should return the same baseURL", () => {
    const instance1 = LastFM_handler.getInstance();
    const instance2 = LastFM_handler.getInstance();

    expect(instance1.baseURL).toBe(instance2.baseURL);
  });

  it("should return the same endURL", () => {
    const instance1 = LastFM_handler.getInstance();
    const instance2 = LastFM_handler.getInstance();

    expect(instance1.endURL).toBe(instance2.endURL);
  });

  it("should return the same username, no set.", () => {
    const instance1 = LastFM_handler.getInstance();
    const instance2 = LastFM_handler.getInstance();

    expect(instance1.getUsername()).toBe(instance2.getUsername());
  })

  it("should return the same username", () => {
    const instance1 = LastFM_handler.getInstance();
    const instance2 = LastFM_handler.getInstance();

    instance1.setUsername("test");

    expect(instance1.getUsername()).toBe(instance2.getUsername());
  })

  it("should return username, set differents unsernames.", () => {
    const instance1 = LastFM_handler.getInstance();
    const instance2 = LastFM_handler.getInstance();

    instance1.setUsername("test1");
    instance2.setUsername("test2");

    expect(instance1.getUsername()).toBe(instance2.getUsername())
    expect(instance1.getUsername()).toBe("test2");
  })

  it("should return User not found error", async () => {
    const instance1 = LastFM_handler.getInstance();

    instance1.setUsername("TomPlanche");

    await expect(instance1.getUserInfo()).rejects.toThrow(UsernameNotFoundError);
  });

  it("should return good user information", async () => {
    const instance = LastFM_handler.getInstance();

    instance.setUsername("tom_planche");

    const userInfo = await instance.getUserInfo();

    for (const key in userInfo) {
      const finalKey = key as keyof T_UserInfoRes;
      expect(userInfo[finalKey]).toBeDefined();
    }

    console.log(userInfo);
  });

  it('should return top tracks (no params) ', async () => {
    const instance = LastFM_handler.getInstance();

    instance.setUsername("tom_planche");

    const response = await instance.getUserTopTracks();

    expect(response).toBeDefined();
    expect(response.toptracks).toBeDefined();
    expect(response.toptracks.track).toBeDefined();
    expect(response.toptracks["@attr"]).toBeDefined();
  });

  it('should return top tracks (params) ', async () => {
    const instance = LastFM_handler.getInstance('tom_planche');


    const response = await instance.getRecentTracks({
      page: 2,
      limit: 20,
    });

    expect(response).toBeDefined();
    expect(response.recenttracks).toBeDefined();

    console.log(response);
  });

  // it('should return now playing', async () => {
  //   const instance = LastFM_handler.getInstance('tom_planche');
  //
  //   const response = await instance.ifNowPlaying();
  //
  //   expect(response).toBeDefined();
  //   expect(response.mbid).toBeDefined();
  //
  //   console.log(response);
  //   console.log(response.mbid);
  // });

  it("should return loved tracks (no params) ", async () => {
    const instance = LastFM_handler.getInstance();

    instance.setUsername("tom_planche");

    const response = await instance.getUserLovedTracks();

    expect(response).toBeDefined();
    expect(response.lovedtracks).toBeDefined();
    expect(response.lovedtracks.track).toBeDefined();
    expect(response.lovedtracks.track[0].artist).toBeDefined();
  });

});

describe("Random tests", () => {
  
  type T_GoodParams = {
    page: number;
    limit: number;
    type: string;
  }
  
  it("test URLSearchParams", () => {
    const params: T_GoodParams = {
      page: 2,
      limit: 10,
      type: "photo d'identité",
    }
    
    const paramsFormatted = Object.keys(params).map((key) => {
      const finalKey = key as keyof T_GoodParams;
      return `${encodeURIComponent(finalKey)}=${encodeURIComponent(params[finalKey])}`;
    }).join('&');

    expect(paramsFormatted).toBe("page=2&limit=10&type=photo%20d'identit%C3%A9");
  })
});
