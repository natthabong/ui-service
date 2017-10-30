package gec.scf.core.config;

public class BrowserInfo {
	private String name;
    private int version;

    public BrowserInfo(String name, int version) {
        this.name = name;
        this.version = version;
    }

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getVersion() {
		return version;
	}

	public void setVersion(int version) {
		this.version = version;
	}
    
}
