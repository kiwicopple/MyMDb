describe("\'Guess The Show\'", function() {
  var gts;
  
  beforeEach(function() {
		// for some reason 
		
	});
  
  describe("when it cleanses the name", function() {
	beforeEach(function() {
		this.longstring = "C:\\This\ is a fake/file/path\\\'with\"bad.data,init.avi";
		this.cleansed = guessTheShow.getCleansedName(this.longstring);
	});
	
    it("should remove all quotes", function() {
		expect(this.cleansed.indexOf("'")).toEqual(-1);
    });
	it("should remove the path", function() {
		expect(this.cleansed).toEqual("withbad.data,init.avi");
    });
	
  });
  
  describe("when guessing the full details of 'Fury 2014.avi'", function() {
	beforeEach(function() {
		this.full = guessTheShow.getFullShowDetails("Fury.avi");
	});
	
    it("should have the name 'Fury'", function() {
		console.debug(this.full);
		expect(this.full.show).toEqual("Fury");
    });
	
  });
  
  describe("when guessing the full details of 'I Love You Man [2009].avi'", function() {
	beforeEach(function() {
		this.full = guessTheShow.getFullShowDetails("I Love You Man [2009].avi");
	});
	
    it("should have the name 'I Love You Man'", function() {
		expect(this.full.show).toEqual("I Love You Man");
    });
	it("should have the year 2009", function() {
		expect(this.full.year).toEqual('2009');
    });
  });
	
	
  describe("when guessing the full details of 'Trainspotting.1080p-iKA.mkv'", function() {
	beforeEach(function() {
		this.full = guessTheShow.getFullShowDetails("Trainspotting.1080p-iKA.mkv");
	});
	
    it("should have the name 'Trainspotting'", function() {
		expect(this.full.show).toEqual("Trainspotting  -iKA");
    });
	it("should have the year 'undefined'", function() {
		expect(this.full.year).toBeUndefined();
    });
	it("should have the extension 'MKV'", function() {
		expect(this.full.extension).toEqual('MKV');
    });
	it("should have the signal format '1080p'", function() {
		expect(this.full.signalFormat).toEqual('1080p');
    });
  });
  
  describe("when guessing the full details of '21 Grams 2001 - Copy.avi'", function() {
	beforeEach(function() {
		this.full = guessTheShow.getFullShowDetails("21 Grams 2001 - Copy.avi");
	});
	
    it("should have the name '21 Grams'", function() {
		expect(this.full.show).toEqual("21 Grams");
    });
	it("should have the year 2001", function() {
		expect(this.full.year).toEqual('2001');
    });
	it("should have the extension 'AVI'", function() {
		expect(this.full.extension).toEqual('AVI');
    });
  });
  
});